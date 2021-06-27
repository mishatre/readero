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
import BookItem from 'Components/BookItem';
import { useHistory } from 'react-router-dom';

const Library = () => {
    useBackgroundColor('#FEFEFE');
    const { settings } = useSettings();
    const { getStats } = useReadingStatsContext();
    const history = useHistory();

    const { library, loadBooks } = useLibraryContext();
    // const { getBookStats } = useReadingStatsContext();

    const onAdd = useFileInput({ multiple: true }, async (files: File[]) => {
        if (files.length === 0) {
            return;
        }
        await loadBooks(files);
    });
    

    const [editing, setEditing] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    const onBookClick = useCallback((id: string) => {
        if(editing) {
            setSelected((selected) => {
                if(selected.includes(id)) {
                    return selected.filter(v => v !== id);
                }
                return [...selected, id];
            });
        } else {
            history.push(`/book/${id}`);
        }
    }, [editing, history]);

    const onSelectAll = useCallback(() => {
        setSelected((prev) => {
            if(prev.length === library.length) {
                return [];
            }
            return library.map((bookInfo) => bookInfo.id);
        });
    }, [library]);
    const onEdit = useCallback(() => {
        setEditing(true);
    }, []);
    const onDone = useCallback(() => {
        setEditing(false);
        setSelected([]);
    }, []);

    return (
        <div className={styles.container}>
            <Header 
                title="Library" 
                editMode={editing}
                allSelected={selected.length === library.length}
                onBookAdd={onAdd} 
                onEdit={onEdit}
                onSelectAll={onSelectAll}
                onDone={onDone}
            />
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {library.map((book) => (
                        <BookItem
                            key={book.id}
                            bookInfo={book}
                            currentWord={getStats(book.id).index}
                            wordsPerMinute={settings.wordsPerMinute}
                            onBookClick={onBookClick}
                            onRestClick={() => {}}
                            selectable={editing}
                            selected={selected.includes(book.id)}
                         />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;
