import BookReader from 'components/BookReader';
import { IBookInfo, useLibraryContext } from 'providers/Library';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styles from './styles.module.scss';

function useBook(id: string) {
    const { getBook } = useLibraryContext();

    const [bookData, setBook] = useState<{
        info: IBookInfo;
        words: string[];
        paragraphs: [number, number[]][];
    } | null>(null);

    useEffect(() => {
        getBook(id).then(({ info, words, paragraphs }) => {
            setBook({
                info,
                words,
                paragraphs
            });
        });
    }, [id, getBook]);

    return bookData;
}

const Reader = () => {
    const { id } = useParams<{ id: string }>();
    const bookInfo = useBook(id);
    const history = useHistory();
    const onBack = useCallback(() => history.push('/'), [history]);

    return (
        <div className={styles.container}>
            {bookInfo && (
                <BookReader
                    info={bookInfo.info}
                    words={bookInfo.words}//bookInfo.words
                    paragraphs={bookInfo.paragraphs}
                    onBack={onBack}
                />
            )}
        </div>
    );
};

export default Reader;
