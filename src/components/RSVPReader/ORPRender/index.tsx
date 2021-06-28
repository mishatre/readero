import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { IFontInfo } from 'types/fontInfo';
import styles from './styles.module.scss';

interface IORPRenderProps {
    fontInfo: IFontInfo;
    word: string;
    width: number;
    // orpPoint: number;
    highlight: boolean;
    guideline: boolean;
}

interface IContainerCSSProperties extends React.CSSProperties {
    '--orpPos': string;
}

const getOrpPos = (length: number) => {
    return length === 1 ? 1 : Math.ceil((length - 1) / 4) + 1;
};

class CharMeasurer {
    private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    private templateChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz1234567890~!@#$%^&*()_+={}:\'"\\,./<>?';
    private chars: Map<string, number> = new Map();
    constructor(fontInfo: IFontInfo) {
        if ('OffscreenCanvas' in globalThis) {
            this.ctx = new OffscreenCanvas(1, 1).getContext('2d')!;
        } else {
            this.ctx = document.createElement('canvas').getContext('2d')!;
        }
        this.ctx.font = `${fontInfo.fontSize}px ${fontInfo.fontFamily}`;
        this.measureChars();
    }
    private measure(char: string) {
        return this.ctx.measureText(char).width;
    }
    measureChars() {
        this.chars = new Map(
            this.templateChars.split('').map((v) => [v, this.measure(v)])
        );
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

function useORPWord({
    fontInfo,
    word,
    width,
}: {
    fontInfo: IFontInfo;
    word: string;
    width: number;
}) {
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

    const [{ orpPoint, maxOffset, maxWords }, set] = useState({
        maxOffset: 0,
        maxWords: 0,
        orpPoint: 0,
    });

    useEffect(() => {
        if (measureRef.current) {
            const maxWords =
                Math.floor((width || 0) / measureRef.current.longestWidth()) -
                1;
            const orpPos =
                getOrpPos(maxWords) * measureRef.current.longestWidth() +
                measureRef.current.longestWidth() / 2 -
                2;
            const maxOffset = getOrpPos(maxWords) + 1;

            set({
                maxOffset,
                maxWords: maxWords - (maxOffset - getOrpPos(maxWords)),
                orpPoint: orpPos,
            });
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
        <span key={3}>{trimmedWord.length > 2 ? r.substr(orp) : ''}</span>,
    ];

    return { chars, orpPoint, maxOffset };
}

const ORPRender = ({
    fontInfo,
    word,
    width,
    // orpPoint,
    highlight,
    guideline,
}: IORPRenderProps) => {
    const { chars, orpPoint } = useORPWord({
        fontInfo,
        word,
        width,
    });

    return (
        <div
            className={cn(styles.container, {
                [styles.highlight]: highlight,
                [styles.guideline]: guideline,
            })}
            style={
                {
                    '--orpPos': `${orpPoint}px`,
                    fontFamily: fontInfo.fontFamily,
                    fontSize: `${fontInfo.fontSize}px`,
                } as IContainerCSSProperties
            }
        >
            {chars}
        </div>
    );
};

export default ORPRender;
