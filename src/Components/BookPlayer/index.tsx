import { useCallback } from 'react';
import cn from 'classnames';
import SingleWordRender from '../SingleWordRender';
import styles from './styles.module.scss';

interface IBookPlayerProps {
    isPlaying: boolean;
    bookText: string[];
    currentWordIndex: number;
    onPlayerClick: () => void;
}

const clamp = (min: number, val: number, max: number) =>
    Math.max(min, Math.min(val, max));

const BookPart = ({
    bookText,
    currentWordIndex,
}: {
    bookText: string[];
    currentWordIndex: number;
}) => {
    const startIndex = Math.max(0, currentWordIndex - 100);
    const stopIndex = Math.min(currentWordIndex + 100, bookText.length);

    const leftPart = bookText.slice(startIndex, currentWordIndex - 1).join(' ');
    const rightPart = bookText.slice(currentWordIndex + 1, stopIndex).join(' ');

    return (
        <div className={styles.text}>
            {leftPart}
            <span className={styles.selected}>
                {' '}
                {bookText[currentWordIndex]}{' '}
            </span>
            {rightPart}
        </div>
    );
};

const BookPlayer = ({
    isPlaying,
    bookText,
    currentWordIndex,
    onPlayerClick,
}: IBookPlayerProps) => {
    const onClickHandler = useCallback(() => {
        if (isPlaying) {
            onPlayerClick();
        }
    }, [isPlaying, onPlayerClick]);

    return (
        <div className={styles.container} onClick={onClickHandler}>
            <div
                className={cn(styles.textPlayer, {
                    [styles.playing]: isPlaying,
                })}
            >
                <SingleWordRender word={bookText[currentWordIndex]} />
            </div>
        </div>
    );
};

export default BookPlayer;
