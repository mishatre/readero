
import BookReader from 'Components/BookReader';
import { IBookInfo, useLibraryContext } from 'Providers/Library';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styles from './styles.module.scss';

function useBook(id: string) {
    const { getBook } = useLibraryContext();

    const [bookData, setBook] =
        useState<{ info: IBookInfo; text: string } | null>(
            null
        );

    useEffect(() => {
        getBook(id).then(({ info, text }) => {
            setBook({
                info,
                text,
            });
        });
    }, [id, getBook]);

    return bookData;
}

const Reader = () => {

    const { id } = useParams<{ id: string }>();
    const bookInfo = useBook(id);
    const history = useHistory();
    const onBack = useCallback(() => history.goBack(), [history]);

    return (
        <div className={styles.container}>
            {bookInfo && 
                <BookReader
                    info={{
                        ...bookInfo.info,

                        totalWords: bookInfo.text.length
                    }}
                    text={bookInfo.text}

                    onBack={onBack}
                />
            }
        </div>
    );
};

export default Reader;
