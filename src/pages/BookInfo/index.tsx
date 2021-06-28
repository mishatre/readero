
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import Header from './Header';
import styles from './styles.module.scss';

interface IBookInfoProps {

}

// eslint-disable-next-line no-empty-pattern
const BookInfo = ({}: IBookInfoProps) => {

    const history = useHistory();
    const onBackButton = useCallback(() => {
        history.push('/');
    }, [history]);

    return (
        <div className={styles.container}>
            <Header onBackButton={onBackButton} />
            <div>
                <div>
                    title
                </div>
                <div>
                    creator
                </div>
                <div>Самые часто встречаемые слова</div>
            </div>
        </div>
    )
}

export default BookInfo;