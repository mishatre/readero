import styles from './styles.module.scss';

import { useLibraryContext } from '../../providers/Library';
// import { useReadingStatsContext } from '../../Providers/ReadingStats';

import useFileInput from '../../hooks/useFileInput';
import { useCallback, useState } from 'react';

import Header from 'pages/Library/Header';
import useBackgroundColor from 'hooks/useBackgroundColor';
import { useSettings } from 'providers/Settings';
import { useReadingStatsContext } from 'providers/ReadingStats';
import BookItem from 'components/BookItem';
import { useHistory } from 'react-router-dom';
import Menu from 'components/Menu';
import EditMenu from './EditMenu';

const Library = () => {
    useBackgroundColor('#FEFEFE');
    const { settings } = useSettings();
    const { getStats } = useReadingStatsContext();
    const history = useHistory();

    const { library, loadBooks, deleteBooks } = useLibraryContext();
    // const { getBookStats } = useReadingStatsContext();

    const onAdd = useFileInput({ multiple: true }, async (files: File[]) => {
        if (files.length === 0) {
            return;
        }
        await loadBooks(files);
    });

    const [editing, setEditing] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    const onDelete = useCallback(() => {
        deleteBooks(selected);
    }, [deleteBooks, selected]);

    const onBookClick = useCallback((id: string) => {
        if (editing) {
            setSelected((selected) => {
                if (selected.includes(id)) {
                    return selected.filter(v => v !== id);
                }
                return [...selected, id];
            });
        } else {
            history.push(`/book/${id}`);
        }
    }, [editing, history]);
    const onRestClick = useCallback((id: string) => {
        history.push(`/bookInfo/${id}`);
    }, [history]);

    const onSelectAll = useCallback(() => {
        setSelected((prev) => {
            if (prev.length === library.length) {
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
                            onRestClick={onRestClick}
                            selectable={editing}
                            selected={selected.includes(book.id)}
                        />
                    ))}
                </div>
            </div>
            {editing
                ? <EditMenu active={selected.length > 0} onDelete={onDelete} />
                : <Menu />
            }
        </div>
    );
};

export default Library;
