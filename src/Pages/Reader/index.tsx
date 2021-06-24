import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IBookInfo, useLibraryContext } from '../../Providers/Library';

import styles from './styles.module.scss';
import VirtualBookPlayer from '../../Components/VirtualBookPlayer';
import BookPlayer from '../../Components/BookPlayer';
import ReaderControls from '../../Components/ReaderControls';
import ReaderHeader from './ReaderHeader';
import { useSettingsContext } from '../../Providers/Settings';
import {
    IBookStat,
    useReadingStatsContext,
} from '../../Providers/ReadingStats';

interface TimerOptions {
    delay: number;
    callback: () => void | number;
}

/** Milliseconds representing forever in the future. */
const never = Number.MAX_SAFE_INTEGER;

function useAccurateTimer(options: TimerOptions) {
    const now = new Date().getTime();
    const [started, setStarted] = useState(false);
    // This is used to trigger a render that checks to fire the timer
    const [, setCheckTime] = useState(now);
    const [nextFireTime, setNextFireTime] = useState(never);

    const isStarted = useCallback(() => started, [started]);
    const isStopped = useCallback(() => !isStarted(), [isStarted]);

    const start = useCallback(() => {
        const currentTime = new Date().getTime();
        const newNextFireTime = options.delay
            ? Math.max(currentTime, currentTime)
            : never;
        setNextFireTime(newNextFireTime);
        setStarted(true);
    }, [options.delay]);

    const stop = useCallback(() => {
        setNextFireTime(never);
        setStarted(false);
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // If it's a timer and it isn't paused...
        if (options.delay && !isStopped()) {
            // Check if we're overdue on any events being fired (super low delay or expensive callback)
            const overdueCalls = Math.max(
                0,
                Math.floor((now - nextFireTime) / options.delay)
            );
            // If we're overdue, this means we're not firing callbacks fast enough and need to prevent
            // exceeding the maximum update depth.
            // To do this, we only fire the callback on an even number of overdues (including 0, no overdues).
            // Else, we wait a little, then try again.
            if (overdueCalls % 2 !== 1) {
                // If the timer is up...
                if (now >= nextFireTime) {
                    let userDelay = 0;
                    // Call the callback
                    if (typeof options.callback === 'function') {
                        try {
                            userDelay = options.callback() || 0;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    // Calculate and set the next time the timer should fire
                    const overdueElapsedTime = overdueCalls * options.delay;
                    const newFireTime = Math.max(
                        now,
                        nextFireTime +
                            options.delay +
                            overdueElapsedTime +
                            userDelay
                    );
                    setNextFireTime(newFireTime);
                    // Set a timeout to check and fire the timer when time's up
                    timeout = setTimeout(() => {
                        // This merely triggers a rerender to check if the timer can fire.
                        setCheckTime(new Date().getTime());
                    }, Math.max(newFireTime - new Date().getTime(), 1));
                }
                // Time is not up yet. Set a timeout to check and fire when time's up
                else if (nextFireTime < never) {
                    timeout = setTimeout(() => {
                        // This merely triggers a rerender to check if the timer can fire.
                        setCheckTime(new Date().getTime());
                        // Home in on the exact time to fire.
                    }, Math.max(nextFireTime - new Date().getTime(), 1));
                }
            } else {
                // Relief valve to avoid maximum update depth exceeded errors.
                // When calls become overdue, there's too expensive of a callback or too low of a delay to keep up.
                // In both cases, the React max update stack will be exceeded due to repeated firings.
                // To relieve this, don't check to fire this time around, but check again in a short time.
                timeout = setTimeout(() => {
                    setCheckTime(new Date().getTime());
                }, 20);
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [now, nextFireTime, isStopped, options.delay, options]);

    return {
        start,
        stop,
    };
}

const Reader = () => {
    const { id } = useParams<{ id: string }>();

    const { getBook } = useLibraryContext();
    const {
        getBookStats,
        updateBookCurrentWordIndex,
        setBookSentenceWordIndex,
        setBookCurrentWordIndex,
    } = useReadingStatsContext();
    const { settings, updateWordsPerMinute } = useSettingsContext();

    const [bookInfo, setBookInfo] = useState<IBookInfo>();
    const [bookItems, setBookItems] = useState<string[]>([]);
    const [bookText, setBookText] = useState<string[]>([]);
    const [{ currentWordIndex, currentSentenceIndex }, setBookStat] =
        useState<IBookStat>({ currentWordIndex: 0, currentSentenceIndex: 0 });

    useEffect(() => {
        getBook(id).then(({ info, items }) => {
            setBookStat(getBookStats(id));
            setBookInfo(info);
            setBookItems(items);
            setBookText(items.join(' ').split(' '));
        });
    }, [id]);

    const [isPlaying, setPlaying] = useState(false);

    const { start, stop } = useAccurateTimer({
        delay: (60 / settings.wordsPerMinute) * 1000,
        callback: () => {
            const newWordIndex = updateBookCurrentWordIndex(id, 1);
            setBookStat((prev) => ({
                ...prev,
                currentWordIndex: newWordIndex,
            }));
            return Math.max(0, bookText[newWordIndex].length - 10) * 20;
        },
    });

    const togglePlay = useCallback(
        () =>
            setPlaying((v) => {
                let newValue = !v;
                if (newValue) {
                    start();
                } else {
                    stop();
                }
                return newValue;
            }),
        [start, stop]
    );

    const speedUp = useCallback(
        () => updateWordsPerMinute(20),
        [updateWordsPerMinute]
    );
    const speedDown = useCallback(
        () => updateWordsPerMinute(-20),
        [updateWordsPerMinute]
    );

    const onPlayerClick = useCallback(() => {
        togglePlay();
    }, [togglePlay]);

    const onSentenceClick = useCallback(
        (index: number) => {
            const newWordIndex =
                bookItems.slice(0, index).join(' ').split(' ').length - 1;
            setBookStat((prev) => ({
                ...prev,
                currentSentenceIndex: index,
                currentWordIndex: newWordIndex,
            }));
            setBookSentenceWordIndex(id, index);
            setBookCurrentWordIndex(id, newWordIndex);
        },
        [setBookSentenceWordIndex, bookItems, id]
    );

    return (
        <div className={styles.container}>
            <ReaderHeader isPlaying={isPlaying} title={bookInfo?.title || ''} />
            {!isPlaying && (
                <VirtualBookPlayer
                    sentences={bookItems}
                    currentIndex={currentSentenceIndex}
                    onSentenceClick={onSentenceClick}
                />
            )}
            {isPlaying && (
                <BookPlayer
                    isPlaying={isPlaying}
                    bookText={bookText}
                    currentWordIndex={currentWordIndex}
                    onPlayerClick={onPlayerClick}
                />
            )}
            <ReaderControls
                isPlaying={isPlaying}
                currentIndex={currentWordIndex}
                speedDown={speedDown}
                speedUp={speedUp}
                togglePlay={togglePlay}
                wordsCount={bookItems.length}
                wordsPerMinute={settings.wordsPerMinute}
            />
        </div>
    );
};

export default Reader;
