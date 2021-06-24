import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLibraryContext } from '../../Providers/Library';

import styles from './styles.module.scss';
import VirtualBookPlayer from '../../Components/VirtualBookPlayer';
import ReaderControls from '../../Components/ReaderControls';
import ReaderHeader from './ReaderHeader';
import { useSettingsContext } from '../../Providers/Settings';



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
    
    const [rawBookText, setRawBookText] = useState<string>('');
    const [bookText, setBookText] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const { id } = useParams<{ id: string }>();
    const {settings, setWordsPerMinute } = useSettingsContext();
    const {
        // loaded,
        getBookContent,
        saveCurrentWordIndex,
    } = useLibraryContext();

    const [title, setTitle] = useState('');

    useEffect(() => {
        getBookContent(id).then(({ info, content, currentWordIndex }) => {
            setTitle(info.title);
            // console.log(content);
            setRawBookText(content);
            // setBookText(content.replaceAll('\n', ' ').split(' '));
            setBookText(content as unknown as string[]);
            setCurrentWordIndex(currentWordIndex || 0);
        });
    }, [id]);
   
    const [speed, setSpeed] = useState(settings.wordsPerMinute);
    const [isPlaying, setPlaying] = useState(false);

    useEffect(() => {
        setSpeed(settings.wordsPerMinute);
    }, [settings.wordsPerMinute]);

    const { start, stop } = useAccurateTimer({
        delay: (60 / speed) * 1000,
        callback: () => {
            setCurrentWordIndex((v) => {
                const newIndex = v + 1;
                saveCurrentWordIndex(id, newIndex);
                return newIndex;
            });
            // console.log(
            //     Math.max(0, bookText[currentWordIndex + 1].length - 10) * 20
            // );
            return Math.max(0, bookText[currentWordIndex + 1].length - 10) * 20;
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

    const speedUp = useCallback(() => {
        setSpeed((curr) => {
            const newSpeed = curr + 20;
            setWordsPerMinute(newSpeed);
            return newSpeed;
        });
    }, [setWordsPerMinute]);
    const speedDown = useCallback(() => {
        setSpeed((curr) => {
            const newSpeed = curr - 20;
            setWordsPerMinute(newSpeed);
            return newSpeed;
        });
    }, [setWordsPerMinute]);

    const onPlayerClick = useCallback(() => {
        togglePlay();
    }, [togglePlay]);

    

    return (
        <div className={styles.container}>
            <ReaderHeader 
                isPlaying={isPlaying}
                title={title} 
            />
            {!isPlaying && 
                <VirtualBookPlayer
                    sentences={bookText}
                    currentIndex={0}
                />
            }
            {/* <BookPlayer
                isPlaying={isPlaying}
                bookText={bookText}
                currentWordIndex={currentWordIndex}
                rawBookText={rawBookText}
                onPlayerClick={onPlayerClick}
            /> */}
            <ReaderControls
                isPlaying={isPlaying}
                currentIndex={currentWordIndex}
                speedDown={speedDown}
                speedUp={speedUp}
                togglePlay={togglePlay}
                wordsCount={bookText.length}
                wordsPerMinute={speed}
            />
        </div>
    );
};

export default Reader;
