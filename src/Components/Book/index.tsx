import cn from 'classnames';
import { Link } from 'react-router-dom';
import { timeToRead, completionRate } from '../../utils/wordTime';
import styles from './styles.module.scss';

import { IBookInfo } from '../../Providers/Storage';

interface IBookProps {
    book: IBookInfo;
    stats: {
        completed: string;
        timeToRead: string;
    };
    onClick: (id: string) => void;
}

function Book({ book, stats, onClick }: IBookProps) {
    const completed = completionRate(1500, 1000);
    const ttr = timeToRead(1500, 1000, 320);

    return (
        <Link to={`/book/${book.id}`} className={styles.container}>
            <div
                className={cn(styles.book, { [styles.nocover]: !book.cover })}
                style={
                    book.cover
                        ? {
                            background: `url(${book.cover})`,
                            backgroundSize: 'cover',
                        }
                        : {}
                }
            >
                <div className={styles.bookWrapper}>
                    <div className={styles.title}>{book.title}</div>
                    <div className={styles.author}>{book.author}</div>
                </div>
            </div>
            <div className={styles.bottom}>
                <div>
                    {stats.completed !== '100'
                        ? `${stats.completed} %`
                        : 'FINISHED'}
                </div>
                <div>{stats.timeToRead}</div>
            </div>
        </Link>
    );
}

export default Book;
