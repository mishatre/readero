import cn from 'classnames';
import clamp from 'utils/clamp';
import styles from './styles.module.scss';

interface IPreviousWordsProps {
    mode: 'view' | 'play' | 'pause';
    showPrevious: boolean;
    words: string[];
    currentIndex: number;
}

const PreviousWords = ({
    mode,
    showPrevious,
    words,
    currentIndex,
}: IPreviousWordsProps) => {
    return (
        <div
            className={cn(styles.previous, {
                [styles.show]: mode === 'pause' && showPrevious,
            })}
        >
            {words
                .slice(clamp(0, currentIndex - 50, words.length), currentIndex)
                .join(' ')}
        </div>
    );
};

export default PreviousWords;
