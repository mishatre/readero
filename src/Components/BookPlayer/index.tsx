import SingleWordRender from '../SingleWordRender';
import styles from './styles.module.scss';

interface IBookPlayerProps {
    isPlaying: boolean;
    rawBookText: string;
    bookText: string[];
    currentWordIndex: number;
    onPlayerClick: () => void;
}

const BookPlayer = ({
    isPlaying,
    rawBookText,
    bookText,
    currentWordIndex,
    onPlayerClick,
}: IBookPlayerProps) => {
    return (
        <div className={styles.container}>
            {!isPlaying && (
                <div className={styles.textContainer}>
                    <div className={styles.text}>{rawBookText}</div>
                </div>
            )}
            {isPlaying && (
                <div className={styles.textPlayer} onClick={onPlayerClick}>
                    <SingleWordRender word={bookText[currentWordIndex]} />
                </div>
            )}
        </div>
    );
};

export default BookPlayer;
