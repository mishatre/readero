import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IBookInfo } from '../../../Providers/Library';
import { useReadingStats } from '../../../Providers/ReadingStats';
import BookRender from '../BookRender';
import ReaderControls from '../ReaderControls';
import ReaderStatusBar from '../ReaderStatusBar';
import ReaderTopBar from '../ReaderTopBar';
import RSVPReader from '../RSVPReader';
import styles from './styles.module.scss';

interface IBookReaderProps {
    info: IBookInfo;
    text: string;
}

const BookReader = ({ info, text }: IBookReaderProps) => {
    const [uiHidden, setUiHidden] = useState(false);
    const [mode, setMode] = useState<'view' | 'play' | 'pause'>('view');
    const { stats, setStats } = useReadingStats(info.id);
    const onNextWord = useCallback(
        (index: number) => setStats(info.id, 'index', index),
        [info.id, setStats]
    );

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Super laggy
        if (mode === 'play' && !uiHidden) {
            timerRef.current = setTimeout(() => {
                if (mode === 'play') {
                    setUiHidden(true);
                }
                timerRef.current = null;
            }, 2000);
            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            };
        }
    }, [mode, uiHidden]);

    const onGoBack = useCallback(() => {
        if (mode === 'pause' || mode === 'play') {
            setMode('view');
        }
    }, [mode]);

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
            <ReaderTopBar
                onGoBack={onGoBack}
                hide={uiHidden}
                mode={mode}
                title={info.title}
            />
            <div className={styles.reader}>
                <RSVPReader
                    mode={mode}
                    text={text}
                    initialIndex={stats.index}
                    onNextWord={onNextWord}
                />
                <BookRender
                    mode={mode}
                    text={text}
                    currentIndex={stats.index}
                    onCurrentIndexChange={onCurrentIndexChange}
                />
            </div>
            <ReaderControls
                hide={uiHidden}
                mode={mode}
                togglePlay={togglePlay}
            />
            <ReaderStatusBar
                hide={uiHidden}
                totalWords={info.totalWords}
                currentWord={stats.index}
            />
        </div>
    );
};

export default BookReader;
