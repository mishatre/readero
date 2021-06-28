import { memo } from 'react';
import cn from 'classnames';

import { ReactComponent as PlayIcon } from 'assets/icons/play-solid.svg';
import { ReactComponent as PauseIcon } from 'assets/icons/pause-solid.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus-solid.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus-solid.svg';

import { ReactComponent as HistoryBackIcon } from 'assets/icons/history-back.svg';
import { ReactComponent as HistoryForwardIcon } from 'assets/icons/history-forward.svg';

import styles from './styles.module.scss';

interface IReaderControlsProps {
    mode: 'view' | 'play' | 'pause';
    hidden: boolean;
    wordsPerMinute: number;
    onPlayPause: () => void;
    onSpeedUp: () => void;
    onSpeedDown: () => void;
    onHistoryGoBack: () => void;
    onHistoryGoForward: () => void;
}

const ReaderControls = ({ mode, hidden, wordsPerMinute, onPlayPause, onSpeedUp, onSpeedDown, onHistoryGoBack, onHistoryGoForward }: IReaderControlsProps) => {
    return (
        <div 
            className={cn(styles.container, { 
                [styles.hidden]: hidden 
            })}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles.middle}>
                <div
                    className={styles.button}
                    onClick={onSpeedDown}
                >
                    <MinusIcon />
                </div>
                <div 
                    className={styles.button} 
                    onClick={onPlayPause}
                >
                    {mode === 'play' ? <PauseIcon /> : <PlayIcon />}
                </div>
                <div
                    className={styles.button}
                    onClick={onSpeedUp}
                >
                    <PlusIcon />
                </div>
            </div>
            <div className={styles.bottom}>
                <div
                    className={styles.button}
                    onClick={onHistoryGoBack}
                >
                    <HistoryBackIcon />
                </div>
                <div className={styles.wpm}>
                    <div>{wordsPerMinute || 420}</div>
                    <div className={styles.label}>wpm</div>
                </div>
                <div
                    className={styles.button}
                    onClick={onHistoryGoForward}
                >
                    <HistoryForwardIcon />
                </div>
            </div>
        </div>
    );
};

export default memo(ReaderControls);
