import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IBookInfo, useLibraryContext } from '../../Providers/Library';

import styles from './styles.module.scss';
import VirtualBookPlayer from '../../Components/VirtualBookPlayer';
import BookPlayer from '../../Components/BookPlayer';
import ReaderControls from '../../Components/ReaderControls';
import ReaderHeader from './ReaderHeader';
import { useSettingsContext } from '../../Providers/Settings';
import {
    IBookStat,
    useReadingStatsContext,
} from '../../Providers/ReadingStats';

function useBook(id: string) {
    const { getBook } = useLibraryContext();

    const [bookData, setBook] =
        useState<{ info: IBookInfo; items: string[]; text: string[] } | null>(
            null
        );

    useEffect(() => {
        getBook(id).then(({ info, items }) => {
            setBook({
                info,
                items,
                text: items.join(' ').split(' '),
            });
        });
    }, [id, getBook]);

    return bookData;
}

function useBookStats(id: string) {
    const {
        getBookStats,
        updateBookCurrentWordIndex,
        setBookSentenceWordIndex,
        setBookCurrentWordIndex,
    } = useReadingStatsContext();

    const [stats, setStats] = useState<IBookStat>({
        currentWordIndex: 0,
        currentSentenceIndex: 0,
    });

    useEffect(() => {
        setStats(getBookStats(id));
    }, [getBookStats, id]);

    return {
        stats,
        setStats,
        updateBookCurrentWordIndex,
        setBookSentenceWordIndex,
        setBookCurrentWordIndex,
    };
}

const Reader = () => {
    const { id } = useParams<{ id: string }>();

    const bookData = useBook(id);
    const { settings, updateWordsPerMinute } = useSettingsContext();
    const {
        stats,
        setStats,
        updateBookCurrentWordIndex,
        setBookSentenceWordIndex,
        setBookCurrentWordIndex,
    } = useBookStats(id);

    const [isPlaying, setPlaying] = useState(false);

    const onTick = useCallback(() => {
        const newWordIndex = updateBookCurrentWordIndex(id, 1);
        setStats((prev) => ({
            ...prev,
            currentWordIndex: newWordIndex,
        }));
        return newWordIndex;
    }, [id, setStats, updateBookCurrentWordIndex]);

    const togglePlay = useCallback(() => setPlaying((v) => !v), []);

    const onSentenceClick = useCallback(
        (index: number) => {
            if (!bookData) {
                return;
            }
            const newWordIndex =
                bookData.items.slice(0, index).join(' ').split(' ').length - 1;
            setStats((prev) => ({
                ...prev,
                currentSentenceIndex: index,
                currentWordIndex: newWordIndex,
            }));
            setBookSentenceWordIndex(id, index);
            setBookCurrentWordIndex(id, newWordIndex);
        },
        [setBookSentenceWordIndex, setStats, bookData, id]
    );

    if (!bookData) {
        return null;
    }

    return (
        <div className={styles.container}>
            <ReaderHeader
                isPlaying={isPlaying}
                title={bookData.info.title || ''}
            />
            {isPlaying ? (
                <BookPlayer
                    isPlaying={isPlaying}
                    bookText={bookData.text}
                    currentWordIndex={stats.currentWordIndex}
                    onPlayerClick={togglePlay}
                    onTick={onTick}
                />
            ) : (
                <VirtualBookPlayer
                    sentences={bookData.items}
                    currentIndex={stats.currentSentenceIndex}
                    onSentenceClick={onSentenceClick}
                />
            )}
            <ReaderControls
                isPlaying={isPlaying}
                currentIndex={stats.currentWordIndex}
                onChangeSpeed={updateWordsPerMinute}
                togglePlay={togglePlay}
                wordsCount={bookData.info.totalWords}
                wordsPerMinute={settings.wordsPerMinute}
            />
        </div>
    );
};

export default Reader;
