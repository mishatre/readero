import Book from '../../Components/Book';
import styles from './styles.module.scss';

import { useLibraryContext } from '../../Providers/Library';
import { useReadingStatsContext } from '../../Providers/ReadingStats';

import useFileInput from '../../hooks/useFileInput';
import { useCallback } from 'react';

import { ReactComponent as PlusIcon } from '../../assets/icons/plus-solid.svg';

const Library = () => {
    const { library, loadBooks } = useLibraryContext();
    const { getBookStats } = useReadingStatsContext();

    const onAdd = useFileInput({ multiple: true }, async (files: File[]) => {
        if (files.length === 0) {
            return;
        }
        await loadBooks(files);
    });

    const onBookClick = useCallback((id: string) => {}, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Library</div>
                <div className={styles.add} onClick={onAdd}>
                    <PlusIcon />
                </div>
            </div>
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {library.map((book) => (
                        <Book
                            key={book.id}
                            book={book}
                            stats={{
                                completed: '100',
                                timeToRead: '1',
                            }}
                            onClick={onBookClick}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.bottomMenu}>
                <div>Library</div>
                <div>Settings</div>
            </div>
        </div>
    );
};

export default Library;
