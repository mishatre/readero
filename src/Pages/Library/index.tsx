

import Book from '../../Components/Book';
import styles from './styles.module.scss';
import EPub from '../../Libraries/epub';

import { useStorageContext } from '../../Providers/Storage';
import useFileInput from '../../hooks/useFileInput';

const Library = () => {

    const { library, addBook } = useStorageContext();
    
    const onAdd = useFileInput({}, (files: File[]) => {
    
        if(files.length === 0) {
            return;
        }

        const selectedFile = files[0];    
        const epub = new EPub(selectedFile);
        epub.parse().then((res) => {

            if(!epub.metadata.id) {
                return;
            }

            addBook({
                id: epub.metadata.id,
                title: epub.metadata.title,
                author: epub.metadata.creator,
                cover: epub.cover || undefined,
                content: epub.compiled,
            })

        });
    })

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    Library
                </div>
                <div className={styles.add} onClick={onAdd}>+</div>
            </div>
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {library.map(bookInfo => <Book key={bookInfo.id} {...bookInfo} /> )}
                </div>
            </div>
            <div className={styles.bottomMenu}>
               <div>
                   Library
               </div>
               <div>
                   Settings
               </div>
            </div>
        </div>
    );
}

export default Library;