import { memo, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useAccurateTimer from 'hooks/useAccurateTimer';
import clamp from 'utils/clamp';
import styles from './styles.module.scss';
import { useSettings } from 'providers/Settings';
import { IFontInfo } from 'types/fontInfo';

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

const getOrpPos = (length: number) => {
    return length === 1 ? 1 : Math.ceil((length - 1) / 4) + 1;
}

class CharMeasurer {
    private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    private templateChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz1234567890~!@#$%^&*()_+={}:'\"\\,./<>?";
    private chars: Map<string, number> = new Map();
    constructor(fontInfo: IFontInfo) {
        if ("OffscreenCanvas" in globalThis) {
            this.ctx = new OffscreenCanvas(1, 1).getContext('2d')!;
        } else {
            this.ctx = document.createElement('canvas').getContext('2d')!;
        }
        this.ctx.font = `${fontInfo.fontSize}px ${fontInfo.fontFamily}`;
        this.measureChars();
    }
    private measure(char: string) {
        return this.ctx.measureText(char).width
    }
    measureChars() {
        this.chars = new Map(this.templateChars.split('').map(v => [v, this.measure(v)]));
    }
    setFont(fontInfo: IFontInfo) {
        this.ctx.font = `${fontInfo.fontSize}px ${fontInfo.fontFamily}`;
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



function useORPWord({ fontInfo, word, width }: { fontInfo: IFontInfo; word: string; width: number; }) {

    const measureRef = useRef<CharMeasurer | null>(null);

    useEffect(() => {
        if (measureRef.current) {
            measureRef.current.setFont(fontInfo);
        }
    }, [fontInfo]);

    useEffect(() => {
        measureRef.current = new CharMeasurer(fontInfo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [{ orpMiddlePointPx, maxOffset, maxWords }, set] = useState({
        maxOffset: 0,
        maxWords: 0,
        orpMiddlePointPx: 0,
    });

    useEffect(() => {
        if (measureRef.current) {
            // console.log(measureRef.current.longestWidth())

            const maxWords = Math.floor((width || 0) / measureRef.current.longestWidth()) - 1;
            const orpPos = getOrpPos(maxWords) * measureRef.current.longestWidth() + measureRef.current.longestWidth() / 2;
            const maxOffset = getOrpPos(maxWords) + 1;

            // console.log(measureRef.current.longestWidth())

            set({
                maxOffset,
                maxWords: maxWords - (maxOffset - getOrpPos(maxWords)),
                orpMiddlePointPx: orpPos,
            })
        }
    }, [width]);

    let r = word.trim().substr(0, maxWords);

    const trimmedWord = r.replaceAll(/^[^a-zа-я\d]*|[^a-zа-я\d]*$/gi, '');
    // const length = trimmedWord.split('').map(v => measurer.measureChar(v));
    const orp = getOrpPos(trimmedWord.length);

    const lpad = ''.padStart(maxOffset - orp, '\u00A0');
    const chars = [
        <span key={1}>{lpad + r.substr(0, orp - 1)}</span>,
        <span key={2}>{r[orp - 1]}</span>,
        <span key={3}>{trimmedWord.length > 2 ? r.substr(orp) : ''}</span>
    ];

    return { chars, orpMiddlePointPx, maxOffset };

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
    useEffect(() => {
        if (prevMode === 'view' && mode !== 'view') {
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
    }, [prevMode, mode]);

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
    const { chars, orpMiddlePointPx } = useORPWord({
        fontInfo,
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
                fontFamily: fontInfo.fontFamily,
                fontSize: `${fontInfo.fontSize}px`,
            }}
        >

            <div className={styles.previous}>
                {mode === 'pause' && showPreviousOnPause && words.slice(clamp(0, currentIndex - 50, words.length), currentIndex).join(' ')}
            </div>
            <div
                className={cn(styles.ORPGuideline, {
                    [styles.disabled]: !settings.ORPGuideLine,
                    [styles.orp]: settings.ORP,
                })}
                style={{
                    '--orpPos': `${orpMiddlePointPx}px`,
                    fontFamily: 'SFMono',
                    lineHeight: '82px',
                } as any}
            >
                {chars}
            </div>
        </div>
    );
};

export default memo(RSVPReader);
