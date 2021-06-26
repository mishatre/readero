import { memo, useCallback } from 'react';
import cn from 'classnames';

import { useSettings } from '../../../Providers/Settings';

import { ReactComponent as PlayIcon } from '../../../assets/icons/play-solid.svg';
import { ReactComponent as PauseIcon } from '../../../assets/icons/pause-solid.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/minus-solid.svg';
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-solid.svg';

import styles from './styles.module.scss';

interface IReaderControlsProps {
    hide: boolean;
    mode: 'view' | 'play' | 'pause';
    togglePlay: () => void;
}

const INCREMENT_VALUE = 20;

const ReaderControls = ({ hide, mode, togglePlay }: IReaderControlsProps) => {
    const { settings, set } = useSettings();

    return (
        <div className={cn(styles.container, { [styles.hidden]: hide })}>
            <div className={styles.buttons}>
                <div
                    className={styles.button}
                    onClick={() =>
                        set('wordsPerMinute', (prev) => prev - INCREMENT_VALUE)
                    }
                >
                    <MinusIcon />
                </div>
                <div className={styles.button} onClick={togglePlay}>
                    {mode === 'play' ? <PauseIcon /> : <PlayIcon />}
                </div>
                <div
                    className={styles.button}
                    onClick={() =>
                        set('wordsPerMinute', (prev) => prev + INCREMENT_VALUE)
                    }
                >
                    <PlusIcon />
                </div>
            </div>
            <div className={styles.bottom}>{settings.wordsPerMinute}</div>
        </div>
    );
};

export default memo(ReaderControls);
