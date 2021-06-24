import { useCallback } from 'react';
import cn from 'classnames';
import SingleWordRender from '../SingleWordRender';
import styles from './styles.module.scss';
import useAccurateTimer from '../../hooks/useAccurateTimer';
import { useSettingsContext } from '../../Providers/Settings';

interface IBookPlayerProps {
    isPlaying: boolean;
    bookText: string[];
    currentWordIndex: number;
    onPlayerClick: () => void;
    onTick: () => number;
}

const BookPlayer = ({
    isPlaying,
    bookText,
    currentWordIndex,
    onPlayerClick,
    onTick,
}: IBookPlayerProps) => {
    const { settings } = useSettingsContext();

    const onClickHandler = useCallback(() => {
        if (isPlaying) {
            onPlayerClick();
        }
    }, [isPlaying, onPlayerClick]);

    const onTimer = useCallback(() => {
        const newWordIndex = onTick();
        return Math.max(0, bookText[newWordIndex].length - 10) * 20;
    }, [onTick, bookText]);

    const delay = (60 / settings.wordsPerMinute) * 1000;
    useAccurateTimer(isPlaying, delay, onTimer);

    return (
        <div
            className={styles.container}
            style={{
                fontFamily: settings.font,
                fontSize: `${settings.fontSize}px`,
            }}
            onClick={onClickHandler}
        >
            <SingleWordRender word={bookText[currentWordIndex]} />
        </div>
    );
};

export default BookPlayer;
