import Book from '../../Components/Book';
import styles from './styles.module.scss';

import { useLibraryContext } from '../../Providers/Library';
// import { useReadingStatsContext } from '../../Providers/ReadingStats';

import useFileInput from '../../hooks/useFileInput';
import { useCallback, useState } from 'react';

import Header from 'Pages/Library/Header';
import useBackgroundColor from 'hooks/useBackgroundColor';
import { useSettings } from 'Providers/Settings';
import { useReadingStatsContext } from 'Providers/ReadingStats';

const Library = () => {
    useBackgroundColor('#FEFEFE');
    const { settings } = useSettings();
    const { getStats } = useReadingStatsContext();

    const { library, loadBooks } = useLibraryContext();
    // const { getBookStats } = useReadingStatsContext();

    const onAdd = useFileInput({ multiple: true }, async (files: File[]) => {
        if (files.length === 0) {
            return;
        }
        await loadBooks(files);
    });
    const onBookClick = useCallback((id: string) => {
    }, []);

    const [editing, setEditing] = useState(false);
    const onSelectAll = useCallback(() => {
        
    }, []);
    const onEdit = useCallback(() => {
        setEditing(true);
    }, []);
    const onDone = useCallback(() => {
        setEditing(false);
    }, []);

    return (
        <div className={styles.container}>
            <Header 
                title="Library" 
                editMode={editing}
                onBookAdd={onAdd} 
                onEdit={onEdit}
                onSelectAll={onSelectAll}
                onDone={onDone}
            />
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {library.map((book) => (
                        <Book
                            key={book.id}
                            book={book}
                            currentWord={getStats(book.id).index}
                            wordsPerMinute={settings.wordsPerMinute}
                            onClick={onBookClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;
