import cn from 'classnames';
import useBackgroundColor from 'hooks/useBackgroundColor';
import useElementSize from 'hooks/useElementSize';
import { useSettings } from 'Providers/Settings';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IBookInfo } from '../../Providers/Library';
import { useReadingStats } from '../../Providers/ReadingStats';
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

    onBack: () => void,
}

function wrapText(text: string, maxWidth: number) {
    if(maxWidth === 0) {
        return [];
    }
    const words = text.split(' ');
    const rows = [];
    let bufferRow: string[] = [];
    let index = 0;
    for(const word of words) {
        bufferRow.push(word);
        if(bufferRow.join(' ').length > maxWidth) {
            const wrappedWord = bufferRow.pop();
            rows.push({
                index,
                text: bufferRow.join(' '),
                words: bufferRow,
            });
            index += bufferRow.length;
            bufferRow = [wrappedWord!];
        }        
    }   

    return rows;    
}

function useWrappedText(text: string, maxWidth: number) {
    const [rows, setRows] = useState<Array<{ index: number; text: string; words: string[]; }>>([]); 
    useEffect(() => {
        setRows(wrapText(text, maxWidth));
    }, [text, maxWidth]);
    return rows;
}

const INCREMENT_VALUE = 20;

const BookReader = ({ info, text, onBack }: IBookReaderProps) => {

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

    const fontInfo = {
        fontFamily: 'SFMono',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: 17
    }

    const fontWidth = useFontWidth(fontInfo.fontFamily, fontInfo.fontSize)
    const rows = useWrappedText(text, Math.floor(width / fontWidth));

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
                        width={width}
                        mode={mode}
                        text={text}
                        initialIndex={stats.index}
                        onNextWord={onNextWord}
                    />
                    <BookRender
                        fontInfo={fontInfo}
                        width={width}
                        mode={mode}
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
                    hidden={uiHidden}
                    totalWords={info.totalWords}
                    currentWord={stats.index}
                />
            </div>
        </div>
    );
};

export default BookReader;
