import { memo, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useAccurateTimer from 'hooks/useAccurateTimer';
import clamp from 'utils/clamp';
import styles from './styles.module.scss';
import ORPWord from './ORPWord';
import { useSettings } from 'Providers/Settings';

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

const getOrpPos = (length: number) => {
    return Math.ceil((length - 1) / 4) + 1;
}

class CharMeasurer {
    private ctx: OffscreenCanvasRenderingContext2D;
    private templateChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz1234567890~!@#$%^&*()_+={}:'\"\\,./<>?";
    private chars: Map<string, number> = new Map();
    constructor() {
        this.ctx = new OffscreenCanvas(1,1).getContext('2d')!;
        this.ctx.font = `${48}px "Lucida console"`;
        this.measureChars();  
    }
    private measure(char: string) {
        return this.ctx.measureText(char).width
    }
    measureChars() {
        this.chars = new Map(this.templateChars.split('').map(v => [v, this.measure(v)]));
    }
    setFont() {
        this.measureChars();
    }
    longestWidth() {
        let maxWidth = 0;
        this.chars.forEach((width, char) => {
            if(width > maxWidth) {
                console.log(char)
                maxWidth = width;
            }
        });
        return maxWidth;
    }
    measureChar(char: string) {
        let charWidth = this.chars.get(char);
        if(!charWidth) {
            charWidth = this.measure(char);
            this.chars.set(char, charWidth);
        }
        return charWidth;
    }
}

const measurer = new CharMeasurer();

function useORPWord({ word, }: { word: string }) {

    const [{ orpMiddlePointPx }, set] = useState({
        orpMiddlePointPx: 0,
    });

    useEffect(() => {

        const maxWords = Math.floor(331/measurer.longestWidth());
        const orpPos = getOrpPos(maxWords) * measurer.longestWidth() + measurer.longestWidth()/2;
        set({
            orpMiddlePointPx: orpPos,
        })

    }, []);

    useEffect(() => {

        const trimmedWord = word.replaceAll(/^[^a-zа-я\d]*|[^a-zа-я\d]*$/gi, '');
        const length = trimmedWord.split('').map(v => measurer.measureChar(v));

        console.log(getOrpPos(trimmedWord.length), length, measurer.measureChar('W'), measurer.longestWidth());
        
        // 32


    }, [word]);

    return { orpMiddlePointPx };

}

const RSVPReader = ({
    mode,
    text,
    initialIndex = 0,
    onNextWord,
}: IRSVPReaderProps) => {
    const { settings } = useSettings();

    const [
        { currentWord, currentIndex, hasNextWord },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const { orpMiddlePointPx } = useORPWord({ word: currentWord });

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
            <div 
                className={cn(styles.ORPGuideline, { [styles.disabled]: !settings.ORPGuideLine })}
                style={{
                    '--orpPos': `${orpMiddlePointPx}px`,
                } as any}
            >
                <div className={styles.topLine}/>
                    {currentWord ? <ORPWord word={currentWord} /> : <>&nbsp;</>}
                <div className={styles.bottomLine}/>
            </div>
        </div>
    );
};

export default memo(RSVPReader);
