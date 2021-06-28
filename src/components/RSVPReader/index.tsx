import { memo, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useAccurateTimer from 'hooks/useAccurateTimer';
import clamp from 'utils/clamp';
import styles from './styles.module.scss';
import { useSettings } from 'providers/Settings';
import { IFontInfo } from 'types/fontInfo';
import ORPRender from './ORPRender';
import MiddlePointRender from './MiddlePointRender';
import PreviousWords from './PreviousWords';

interface IRSVPReaderProps {
    fontInfo: IFontInfo;
    width: number;
    mode: 'view' | 'play' | 'pause';
    words: string[];
    initialIndex?: number;
    onNextWord?: (index: number) => void;
    showPreviousOnPause: boolean;
}

interface IRSPVReaderState {
    currentWord: string;
    currentIndex: number;
    hasNextWord: boolean;
}

function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const RSVPReader = ({
    fontInfo,
    width,
    mode,
    words,
    initialIndex = 0,
    onNextWord,
    showPreviousOnPause,
}: IRSVPReaderProps) => {
    const { settings } = useSettings();

    const [
        { currentWord, currentIndex, hasNextWord },
        set,
    ] = useState<IRSPVReaderState>({
        currentWord: '',
        currentIndex: 0,
        hasNextWord: false,
    });

    useEffect(() => {
        const wordCount = words.length;

        const state = {
            currentWord: '',
            currentIndex: 0,
            hasNextWord: false,
        };

        if (wordCount > 0) {
            const initial = clamp(0, initialIndex || 0, wordCount);

            const currentWord = words[initial];

            if (currentWord) {
                state.currentIndex = initial;
                state.currentWord = currentWord;
                state.hasNextWord = wordCount > initial;
            }
        }

        set(state);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [words, onNextWord]);

    const prevMode = usePrevious(mode);
    const prevInitialIndex = usePrevious(initialIndex);
    useEffect(() => {
        if ((prevMode === 'view' && mode !== 'view') || (mode !== 'view' && prevInitialIndex !== initialIndex)) {
            const wordCount = words.length;

            const state = {
                currentWord: '',
                currentIndex: 0,
                hasNextWord: false,
            };

            if (wordCount > 0) {
                const initial = clamp(0, initialIndex || 0, wordCount);

                const currentWord = words[initial];

                if (currentWord) {
                    state.currentIndex = initial;
                    state.currentWord = currentWord;
                    state.hasNextWord = wordCount > initial;
                }
            }

            set(state);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialIndex, prevMode, mode]);

    useEffect(() => {
        onNextWord?.(currentIndex);
    }, [onNextWord, currentIndex]);

    const onTick = useCallback(() => {
        set((currState) => {
            const newState = { ...currState };
            const nextWord = words[currState.currentIndex + 1];
            if (nextWord) {
                newState.currentWord = nextWord;
                newState.currentIndex++;
                newState.hasNextWord = words.length > newState.currentIndex;
            } else {
                newState.hasNextWord = false;
            }
            return newState;
        });
    }, [words]);

    const delay = (60 / settings.wordsPerMinute) * 1000;
    useAccurateTimer(mode === 'play' && hasNextWord, delay, onTick);

    if (mode === 'view') {
        return null;
    }

    return (
        <div
            className={styles.container}
            style={{
                fontFamily: fontInfo.fontFamily,
                fontSize: `${fontInfo.fontSize}px`,
            }}
        >
            <PreviousWords
                mode={mode}
                showPrevious={showPreviousOnPause}
                words={words}
                currentIndex={currentIndex}
            />
            {settings.renderType === 'ORP' &&
                <ORPRender
                    word={currentWord}
                    fontInfo={fontInfo}
                    guideline={settings.ORPGuideLine}
                    highlight={settings.ORP}
                    width={width}
                />
            }
            {settings.renderType === 'middle' &&
                <MiddlePointRender
                    fontInfo={fontInfo}
                    word={currentWord}
                    highlight={settings.ORP}
                />
            }
        </div>
    );
};

export default memo(RSVPReader);
