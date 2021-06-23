import { ReactComponent as PlayIcon } from '../../assets/icons/play-solid.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause-solid.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-solid.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-solid.svg';

import styles from './styles.module.scss';
import { completionRate, timeToRead } from '../../utils/wordTime';
import { useCallback } from 'react';

interface IReaderControlsProps {
    isPlaying: boolean;

    speedDown: () => void;
    speedUp: () => void;
    togglePlay: () => void;

    wordsCount: number;
    currentIndex: number;
    wordsPerMinute: number;
}

const ReaderControls = ({
    isPlaying,

    speedDown,
    speedUp,
    togglePlay,

    wordsCount,
    currentIndex,
    wordsPerMinute,
}: IReaderControlsProps) => {
    const completed = completionRate(wordsCount, currentIndex);
    const ttr = timeToRead(wordsCount, currentIndex, wordsPerMinute);

    const speedDownHanlder = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        speedDown();
    }, [speedDown]);

    const speedUpHanlder = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        speedUp();
    }, [speedUp]);

    return (
        <div className={styles.container} onClick={togglePlay}>
            <div className={styles.topLine} />
            <div className={styles.controls}>
                <MinusIcon className={styles.button} onClick={speedDownHanlder} />
                <div className={styles.wordsPerMinute}>{wordsPerMinute} <br /> word/m</div>
                <PlusIcon className={styles.button} onClick={speedUpHanlder} />
            </div>
            <div className={styles.stats}>
                <div className={styles.bar} style={{ '--total': `${completed}%` } as any} />
                <div className={styles.bottom}>
                    <div>{ttr}</div>
                    <div>{completed}%</div>
                </div>
            </div>
        </div>
    );
};

export default ReaderControls;
