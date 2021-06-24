import { useCallback, useEffect, useState } from 'react';

/** Milliseconds representing forever in the future. */
const never = Number.MAX_SAFE_INTEGER;

function useAccurateTimer(
    isPlaying: boolean,
    delay: number,
    callback: () => void | number
) {
    const now = new Date().getTime();
    // This is used to trigger a render that checks to fire the timer
    const [, setCheckTime] = useState(now);
    const [nextFireTime, setNextFireTime] = useState(never);

    useEffect(() => {
        if (isPlaying) {
            const currentTime = new Date().getTime();
            const newNextFireTime = delay
                ? Math.max(currentTime, currentTime)
                : never;
            setNextFireTime(newNextFireTime);
        } else {
            setNextFireTime(never);
        }
    }, [isPlaying, delay]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // If it's a timer and it isn't paused...
        if (delay && isPlaying) {
            // Check if we're overdue on any events being fired (super low delay or expensive callback)
            const overdueCalls = Math.max(
                0,
                Math.floor((now - nextFireTime) / delay)
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
                    if (typeof callback === 'function') {
                        try {
                            userDelay = callback() || 0;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    // Calculate and set the next time the timer should fire
                    const overdueElapsedTime = overdueCalls * delay;
                    const newFireTime = Math.max(
                        now,
                        nextFireTime + delay + overdueElapsedTime + userDelay
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
    }, [now, nextFireTime, isPlaying, delay, callback]);
}

export default useAccurateTimer;
