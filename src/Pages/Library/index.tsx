import Book from '../../Components/Book';
import styles from './styles.module.scss';
import EPub from '../../Libraries/epub';

import { useStorageContext } from '../../Providers/Storage';
import useFileInput from '../../hooks/useFileInput';
import { useCallback } from 'react';

import { ReactComponent as PlusIcon } from '../../assets/icons/plus-solid.svg';
import epubToTxt from '../../Libraries/epubToTxt';

const Library = () => {
    const { library, settings, addBook } = useStorageContext();

    const onAdd = useFileInput({}, (files: File[]) => {
        if (files.length === 0) {
            return;
        }

        const selectedFile = files[0];
        epubToTxt(selectedFile).then((data: any) => {
            if (!data.metadata.id) {
                return;
            }

            addBook({
                ...data.metadata,
                cover: data.cover || undefined,
                content: data.content,
            });
        });
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
