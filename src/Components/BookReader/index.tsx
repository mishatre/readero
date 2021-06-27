import cn from 'classnames';
import useBackgroundColor from 'hooks/useBackgroundColor';
import useElementSize from 'hooks/useElementSize';
import { useSettings } from 'providers/Settings';
import { useCallback, useMemo, useRef, useState } from 'react';
import { IBookInfo } from '../../providers/Library';
import { useReadingStats } from '../../providers/ReadingStats';
import BookRender from '../BookRender';
import ReaderControls from '../ReaderControls';
import ReaderStatusBar from '../ReaderStatusBar';
import ReaderHeader from '../ReaderHeader';
import RSVPReader from '../RSVPReader';
import styles from './styles.module.scss';

import useFontWidth from 'hooks/useFontWidth';

interface IBookReaderProps {
    info: IBookInfo;
    text: string;
    words: string[];

    onBack: () => void,
}

function wrapText(words: string[], maxWidth: number) {
    if (maxWidth === 0) {
        return [];
    }

    const rows = [];
    let index = 0;

    let bufferLength = 0;

    let i = 0;
    let startIndex = 0;
    let l = words.length;
    while (i < l) {
        const currWordLength = words[i].length;
        if ((bufferLength + currWordLength + 1) > maxWidth) {
            rows.push({
                index,
                startIndex: startIndex,
                endIndex: i,
            });
            index += i - startIndex;
            bufferLength = 0;
            startIndex = i;
        }
        bufferLength += currWordLength + 1;
        ++i;
    }

    return rows;
}

const INCREMENT_VALUE = 20;

const BookReader = ({ info, text, words, onBack }: IBookReaderProps) => {

    const { settings, set } = useSettings();

    const [uiHidden, setUiHidden] = useState(false);
    const [mode, setMode] = useState<'view' | 'play' | 'pause'>('view');
    const { stats, setStats } = useReadingStats(info.id);
    const onNextWord = useCallback(
        (index: number) => setStats(info.id, 'index', index),
        [info.id, setStats]
    );

    useBackgroundColor(mode === 'view' ? '#FEFEFE' : '#edd1b0');

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const togglePlay = useCallback(() => {
        setMode((value) => {
            if (value === 'play') {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
                return 'pause';
            }
            return 'play';
        });
    }, []);

    const onCurrentIndexChange = useCallback(
        (index: number) => {
            setStats(info.id, 'index', index);
        },
        [info.id, setStats]
    );

    const ref = useRef<HTMLDivElement>(null);
    const { width } = useElementSize(ref);

    // Header

    const onBackButton = useCallback(() => {
        if (mode === 'pause' || mode === 'play') {
            setMode('view');
        } else {
            onBack();
        }
    }, [mode, onBack]);

    const onChangeFont = useCallback(() => {
        togglePlay();
    }, [togglePlay]);
    const onSetORP = useCallback(() => set('ORP', v => !v), [set]);
    const onSetORPGuidelines = useCallback(() => set('ORPGuideLine', v => !v), [set]);

    // Controls

    const onPlayPause = useCallback(() => togglePlay(), [togglePlay]);
    const onSpeedUp = useCallback(() => set('wordsPerMinute', (prev) => prev + INCREMENT_VALUE), [set]);
    const onSpeedDown = useCallback(() => set('wordsPerMinute', (prev) => prev - INCREMENT_VALUE), [set]);

    const onReaderClick = useCallback(() => {
        if (mode === 'play' && uiHidden) {
            setUiHidden(false);
        } else if (mode === 'play' && !uiHidden) {
            setUiHidden(true);
        } else if (mode !== 'play' && uiHidden) {
            setUiHidden(false);
        }
    }, [mode, uiHidden]);

    const readerFontInfo = {
        fontFamily: settings.fontFamilyReader,
        fontSize: settings.fontSizeReader,
        fontWeight: 'normal',
        lineHeight: 17
    }

    const rsvpFontInfo = {
        fontFamily: settings.fontFamilyRSVP,
        fontSize: settings.fontSizeRSVP,
        fontWeight: 'normal',
        lineHeight: 17
    }

    const fontWidth = useFontWidth(readerFontInfo.fontFamily, readerFontInfo.fontSize)
    const rows = useMemo(() => wrapText(words, Math.floor((width - 10) / fontWidth)), [words, width, fontWidth]);

    return (
        <div
            className={cn(styles.container, {
                [styles.playing]: mode !== 'view',
            })}
            onClick={onReaderClick}
        >
            <ReaderHeader
                mode={mode}
                hidden={uiHidden}
                title={info.title}

                onBackButton={onBackButton}
                onChangeFont={onChangeFont}
                onSetORP={onSetORP}
                onSetORPGuidelines={onSetORPGuidelines}

            />
            <div className={styles.content}>
                <div ref={ref} className={styles.reader}>
                    <RSVPReader
                        fontInfo={rsvpFontInfo}
                        width={width}
                        mode={mode}
                        words={words}
                        initialIndex={stats.index}
                        onNextWord={onNextWord}
                        showPreviousOnPause={settings.showPreviousOnPause}
                    />
                    <BookRender
                        fontInfo={readerFontInfo}
                        width={width}
                        mode={mode}
                        words={words}
                        rows={rows}
                        currentIndex={stats.index}
                        onCurrentIndexChange={onCurrentIndexChange}
                    />
                </div>
                <ReaderControls
                    mode={mode}
                    hidden={uiHidden}
                    wordsPerMinute={settings.wordsPerMinute}
                    onPlayPause={onPlayPause}
                    onSpeedUp={onSpeedUp}
                    onSpeedDown={onSpeedDown}
                />
                <ReaderStatusBar
                    mode={mode}
                    hidden={uiHidden}
                    totalWords={info.totalWords}
                    currentWord={stats.index}
                />
            </div>
        </div>
    );
};

export default BookReader;
