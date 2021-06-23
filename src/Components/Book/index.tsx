
import cn from 'classnames';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

interface IBookProps {
    id: string;
    title: string;
    author: string;
    ttc?: string;
    completed?: number;
    cover?: string;
}

function Book({
    id,
    title,
    author,
    completed,
    ttc,
    cover
}: IBookProps) {

    return (
        <Link to={`/book/${id}`} className={styles.container} >
            <div className={cn(styles.book, { [styles.nocover]: !cover })} style={cover ? ({ background: `url(${cover})`, backgroundSize: 'cover' }) : {}}>
                <div className={styles.bookWrapper}>
                    {!cover && <div className={styles.title}>{title}</div>}
                    {!cover && <div className={styles.author}>{author}</div>}
                </div>
            </div>
            <div className={styles.bottom}>
                <div>{completed}%</div>
                <div>{ttc}</div>
            </div>
        </Link>
    );
}

export default Book;