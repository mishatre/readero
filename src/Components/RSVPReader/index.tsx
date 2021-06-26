import { memo, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useAccurateTimer from 'hooks/useAccurateTimer';
import clamp from 'utils/clamp';
import styles from './styles.module.scss';
import { useSettings } from 'Providers/Settings';

interface IRSVPReaderProps {
    width: number;
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
    return length === 1 ? 1 : Math.ceil((length - 1) / 4) + 1;
}

class CharMeasurer {
    private ctx: OffscreenCanvasRenderingContext2D;
    private templateChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz1234567890~!@#$%^&*()_+={}:'\"\\,./<>?";
    private chars: Map<string, number> = new Map();
    constructor() {
        this.ctx = new OffscreenCanvas(1, 1).getContext('2d')!;
        this.ctx.font = `${48}px "Liberation Mono"`;
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
            if (width > maxWidth) {
                // console.log(char)
                maxWidth = width;
            }
        });
        return maxWidth;
    }
    measureChar(char: string) {
        let charWidth = this.chars.get(char);
        if (!charWidth) {
            charWidth = this.measure(char);
            this.chars.set(char, charWidth);
        }
        return charWidth;
    }
}

const measurer = new CharMeasurer();

function useORPWord({ word, width }: { word: string; width: number; }) {

    console.log(width)

    const [{ orpMiddlePointPx, maxOffset, maxWords }, set] = useState({
        maxOffset: 0,
        maxWords: 0,
        orpMiddlePointPx: 0,
    });

    useEffect(() => {

        const maxWords = Math.floor((width || 0) / measurer.longestWidth()) - 1;
        const orpPos = getOrpPos(maxWords) * measurer.longestWidth() + measurer.longestWidth() / 2;
        const maxOffset = getOrpPos(maxWords) + 1;

        set({
            maxOffset,
            maxWords: maxWords - (maxOffset - getOrpPos(maxWords)),
            orpMiddlePointPx: orpPos,
        })

    }, [width]);

    let r = word.trim().substr(0, maxWords);

    const trimmedWord = r.replaceAll(/^[^a-zа-я\d]*|[^a-zа-я\d]*$/gi, '');
    // const length = trimmedWord.split('').map(v => measurer.measureChar(v));
    const orp = getOrpPos(trimmedWord.length);

    const lpad = ''.padStart(maxOffset - orp, '\u00A0');
    const chars = [
        lpad + r.substr(0, orp - 1),
        r[orp - 1],
        trimmedWord.length > 2 ? r.substr(orp) : ''
    ];

    return { chars, orpMiddlePointPx, maxOffset };

}

const RSVPReader = ({
    width,
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
    const { chars, orpMiddlePointPx } = useORPWord({
        word: currentWord,
        width,
    });

    if (mode === 'view') {
        return null;
    }

    return (
        <div
            className={styles.container}
            style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
            }}
        >
            <div
                className={cn(styles.ORPGuideline, {
                    [styles.disabled]: !settings.ORPGuideLine,
                    [styles.orp]: settings.ORP,
                })}
                style={{
                    '--orpPos': `${orpMiddlePointPx}px`,
                    fontFamily: 'Liberation Mono',
                    lineHeight: '72px',
                } as any}
            >
                {chars.map((v, i) => <span key={i}>{v}</span>)}
            </div>
        </div>
    );
};

export default memo(RSVPReader);
