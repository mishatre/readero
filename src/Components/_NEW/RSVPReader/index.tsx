import { memo, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useAccurateTimer from '../../../hooks/useAccurateTimer';
import clamp from '../../../utils/clamp';
import styles from './styles.module.scss';
import ORPWord from './ORPWord';
import ORPGuideline from './ORPGuideline';
import { useSettings } from '../../../Providers/Settings';

interface IRSVPReaderProps {
    mode: 'view' | 'play' | 'pause';
    text: string;
    initialIndex?: number;
    onNextWord?: (index: number) => void;
}

interface IRSPVReaderState {
    currentWord: string;
    currentIndex: number;
    hasNextWord: boolean;
    items: string[];
}

function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const RSVPReader = ({
    mode,
    text,
    initialIndex = 0,
    onNextWord,
}: IRSVPReaderProps) => {
    const { settings } = useSettings();

    const [
        { currentWord, currentIndex, hasNextWord, items },
        set,
    ] = useState<IRSPVReaderState>({
        currentWord: '',
        currentIndex: 0,
        hasNextWord: false,
        items: [],
    });

    useEffect(() => {
        if (!text) {
            return;
        }

        const items = text.split(' ');
        const wordCount = items.length;

        const state = {
            currentWord: '',
            currentIndex: 0,
            hasNextWord: false,
            items,
        };

        if (wordCount > 0) {
            const initial = clamp(0, initialIndex || 0, wordCount);

            const currentWord = items[initial];

            if (currentWord) {
                state.currentIndex = initial;
                state.currentWord = currentWord;
                state.hasNextWord = items.length > initial;
            }
        }

        set(state);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, onNextWord]);

    const prevMode = usePrevious(mode);
    useEffect(() => {
        if (prevMode === 'view' && mode !== 'view') {
            const items = text.split(' ');
            const wordCount = items.length;

            const state = {
                currentWord: '',
                currentIndex: 0,
                hasNextWord: false,
                items,
            };

            if (wordCount > 0) {
                const initial = clamp(0, initialIndex || 0, wordCount);

                const currentWord = items[initial];

                if (currentWord) {
                    state.currentIndex = initial;
                    state.currentWord = currentWord;
                    state.hasNextWord = items.length > initial;
                }
            }

            set(state);
        }
    }, [prevMode, mode]);

    useEffect(() => {
        onNextWord?.(currentIndex);
    }, [onNextWord, currentIndex]);

    const onTick = useCallback(() => {
        set((currState) => {
            const newState = { ...currState };
            const nextWord = currState.items[currState.currentIndex + 1];
            if (nextWord) {
                newState.currentWord = nextWord;
                newState.currentIndex++;
                newState.hasNextWord =
                    currState.items.length > newState.currentIndex;
            } else {
                newState.hasNextWord = false;
            }
            return newState;
        });
    }, []);

    const delay = (60 / settings.wordsPerMinute) * 1000;
    useAccurateTimer(mode === 'play' && hasNextWord, delay, onTick);

    if (mode === 'view') {
        return null;
    }

    return (
        <div
            className={cn(styles.container, {
                [styles.orp]: settings.ORP,
            })}
            style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
            }}
        >
            <ORPGuideline visible={settings.ORPGuideLine}>
                {currentWord ? <ORPWord word={currentWord} /> : <>&nbsp;</>}
            </ORPGuideline>
        </div>
    );
};

export default memo(RSVPReader);
