import { ReactComponent as PlayIcon } from '../../assets/icons/play-solid.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause-solid.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-solid.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-solid.svg';

import styles from './styles.module.scss';
import { completionRate, timeToRead } from '../../utils/wordTime';

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

    return (
        <div className={styles.container}>
            <div>
                <div>Time to read</div>
                <div>{ttr}</div>
            </div>
            <div className={styles.controls}>
                <div className={styles.speedButtons}>
                    <div className={styles.button} onClick={speedDown}>
                        <MinusIcon />
                    </div>
                    <div className={styles.button} onClick={togglePlay}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}{' '}
                        {wordsPerMinute}
                    </div>
                    <div className={styles.button} onClick={speedUp}>
                        <PlusIcon />
                    </div>
                </div>
            </div>
            <div>
                <div>Read</div>
                <div>{completed} %</div>
            </div>
        </div>
    );
};

export default ReaderControls;
