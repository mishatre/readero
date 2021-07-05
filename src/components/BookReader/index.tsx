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
import clamp from 'utils/clamp';
import useKeyPress from 'hooks/useKeyPress';

interface IBookReaderProps {
    info: IBookInfo;
    words: string[];
    paragraphs: [number, number[]][];

    onBack: () => void;
}

const INCREMENT_VALUE = 20;

function usePlayer() {
    const [mode, setMode] = useState<'view' | 'play' | 'pause'>('view');

    const play = useCallback(() => setMode('play'), []);
    const pause = useCallback(() => setMode('pause'), []);
    const toggle = useCallback(() => {
        setMode((value) => {
            if (value === 'play') {
                return 'pause';
            }
            return 'play';
        });
    }, []);
    const reset = useCallback(() => setMode('view'), []);

    return {
        mode,
        play,
        pause,
        toggle,
        reset,
    };
}

const BookReader = ({ info, words, paragraphs, onBack }: IBookReaderProps) => {
    const {
        settings,
        readerFontInfo,
        rsvpFontInfo,
        fontWidth,
        dimensions,
        maxCharsPerRow,
        set,
    } = useSettings();

    const { stats, setStats } = useReadingStats(info.id);
    const [uiHidden, setUiHidden] = useState(false);

    const { mode, play, pause, reset } = usePlayer();
    useBackgroundColor(mode === 'view' ? '#FEFEFE' : '#edd1b0');
    useKeyPress(' ', () => {
        if(mode === 'pause' || mode === 'view') {
            play();
        } else if(mode === 'play') {
            pause();
        }
    }, [mode]);
    const onNextWord = useCallback(
        (index: number) => setStats(info.id, 'index', index),
        [info.id, setStats]
    );

    const onCurrentIndexChange = useCallback(
        (index: number) => {
            setStats(info.id, 'index', clamp(0, index, info.totalWords));
        },
        [info.id, info.totalWords, setStats]
    );

    const onHistoryGoBack = useCallback(
        () => onCurrentIndexChange(stats.index - 15),
        [onCurrentIndexChange, stats.index]
    );
    const onHistoryGoForward = useCallback(
        () => onCurrentIndexChange(stats.index + 15),
        [onCurrentIndexChange, stats.index]
    );

    // Header

    const onBackButton = useCallback(() => {
        if (mode === 'pause' || mode === 'play') {
            reset();
        } else {
            onBack();
        }
    }, [mode, reset, onBack]);

    const onChangeFont = useCallback(() => {
        pause();
    }, [pause]);
    const onSetORP = useCallback(() => set('ORP', (v) => !v), [set]);
    const onSetORPGuidelines = useCallback(
        () => set('ORPGuideLine', (v) => !v),
        [set]
    );

    // Controls

    const onSpeedUp = useCallback(
        () => set('wordsPerMinute', (prev) => prev + INCREMENT_VALUE),
        [set]
    );
    const onSpeedDown = useCallback(
        () => set('wordsPerMinute', (prev) => prev - INCREMENT_VALUE),
        [set]
    );

    const onReaderClick = useCallback(() => {
        if (mode === 'play' && uiHidden) {
            setUiHidden(false);
        } else if (mode === 'play' && !uiHidden) {
            setUiHidden(true);
        } else if (mode !== 'play' && uiHidden) {
            setUiHidden(false);
        }
    }, [mode, uiHidden]);

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
                <div className={styles.reader}>
                    <RSVPReader
                        fontInfo={rsvpFontInfo}
                        width={dimensions.width - 80}
                        mode={mode}
                        words={words}
                        initialIndex={stats.index}
                        onNextWord={onNextWord}
                        showPreviousOnPause={settings.showPreviousOnPause}
                    />
                    <BookRender
                        fontInfo={readerFontInfo}
                        width={dimensions.width}
                        mode={mode}
                        words={words}
                        paragraphs={paragraphs}
                        maxCharsPerRow={maxCharsPerRow}
                        currentIndex={stats.index}
                        onCurrentIndexChange={onCurrentIndexChange}
                    />
                </div>
                <ReaderControls
                    mode={mode}
                    hidden={uiHidden}
                    wordsPerMinute={settings.wordsPerMinute}
                    onPlay={play}
                    onPause={pause}
                    onSpeedUp={onSpeedUp}
                    onSpeedDown={onSpeedDown}
                    onHistoryGoBack={onHistoryGoBack}
                    onHistoryGoForward={onHistoryGoForward}
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
