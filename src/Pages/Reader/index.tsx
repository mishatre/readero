import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStorageContext } from "../../Providers/Storage";

import SingleWordRender from '../../Components/SingleWordRender';

import { ReactComponent as CogIcon } from '../../assets/icons/cog-solid.svg';
import { ReactComponent as AngleLeft } from '../../assets/icons/angle-left-solid.svg';

import { ReactComponent as PlayIcon } from '../../assets/icons/play-solid.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause-solid.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-solid.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-solid.svg';

import styles from './styles.module.scss';

interface TimerOptions {
    delay: number;
    callback: () => void;
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
        const newNextFireTime = options.delay ? Math.max(currentTime, currentTime) : never;
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
            const overdueCalls = Math.max(0, Math.floor((now - nextFireTime) / options.delay));
            // If we're overdue, this means we're not firing callbacks fast enough and need to prevent
            // exceeding the maximum update depth.
            // To do this, we only fire the callback on an even number of overdues (including 0, no overdues).
            // Else, we wait a little, then try again.
            if (overdueCalls % 2 !== 1) {
                // If the timer is up...
                if (now >= nextFireTime) {
                    // Call the callback
                    if (typeof options.callback === 'function') {
                        try {
                            options.callback();
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    // Calculate and set the next time the timer should fire
                    const overdueElapsedTime = overdueCalls * options.delay;
                    const newFireTime = Math.max(now, nextFireTime + options.delay + overdueElapsedTime);
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
    }

}

function secondsToStr (seconds1: number) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();
    var temp = seconds1;
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' d';
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' h';
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' m';
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' s';
    }
    return '0'; //'just now' //or other string you like;
}

const Reader = () => {

    const [rawBookText, setRawBookText] = useState<string>('');
    const [bookText, setBookText] = useState<string[]>([]);

    const { id } = useParams<{ id: string; }>();
    const { loaded, getBookContent } = useStorageContext();

    const [title, setTitle] = useState('');

    useEffect(() => {
        if(!loaded) {
            return;
        }
        getBookContent(id)
            .then(({ info, content }) => {
                setTitle(info.title);
                setRawBookText(content);
                setBookText(content.split(' '));
            });
    }, [loaded, id]);

    const [speed, setSpeed] = useState(320);
    const [isPlaying, setPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const { start, stop } = useAccurateTimer({ 
        delay: (60 / speed) * 1000,
        callback: () => {
            setCurrentWordIndex(v => v + 1);
        }
    });

    const togglePlay = useCallback(() => setPlaying(v => {
        let newValue = !v;
        if(newValue) {
            start();
        } else {
            stop();
        }
        return newValue;
    }), [start, stop]);
   
    const speedUp = useCallback(() => setSpeed(curr => curr + 20), []);
    const speedDown = useCallback(() => setSpeed(curr => curr - 20), []);
    
    const onPlayerClick = useCallback(() => {
        togglePlay();
    }, [togglePlay]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <AngleLeft />
                <div className={styles.title}>{title}</div>
                <CogIcon />
            </div>
            {!isPlaying && 
                <div className={styles.textContainer}>
                    <div className={styles.text}>{rawBookText}</div>
                </div>
            }
            {isPlaying && 
                <div className={styles.textPlayer} onClick={onPlayerClick}>
                    <SingleWordRender word={bookText[currentWordIndex]} />
                </div>
            }
            <div className={styles.bottomMenu}>
                <div>{secondsToStr(Math.floor((bookText.length - currentWordIndex) / (speed / 60)))}</div>
                <div className={styles.controls}>
                    <div className={styles.speedButtons}>
                        <div className={styles.button} onClick={speedDown}><MinusIcon /></div>
                        <div className={styles.button} onClick={togglePlay}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon/> } {speed}</div>
                        <div className={styles.button} onClick={speedUp}><PlusIcon /></div>
                    </div>
                </div>
                <div>{((currentWordIndex / bookText.length) * 100).toFixed(1)} %</div>
            </div>
        </div>
    );
}

export default Reader;