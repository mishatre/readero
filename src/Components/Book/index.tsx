import cn from 'classnames';
import { Link } from 'react-router-dom';
import { timeToRead, completionRate } from '../../utils/wordTime';
import styles from './styles.module.scss';

import { IBookInfo } from '../../Providers/Library';
import { useRef } from 'react';

interface IBookProps {
    book: IBookInfo;
    stats: {
        completed: string;
        timeToRead: string;
    };
    onClick: (id: string) => void;
}

function Book({ book, stats, onClick }: IBookProps) {

    const wrapperRef = useRef<HTMLDivElement>(null);

    const completed = completionRate(1500, 1000);
    const ttr = timeToRead(1500, 1000, 320);
    console.log(book)
    return (
        <Link to={`/book/${book.id}`} className={styles.container}>
            <div
                className={cn(styles.book, styles.nocover, {
                    [styles.nocover]: !book.cover,
                    [styles.nocover]: book.cover,
                })}
                // style={
                //     book.cover
                //         ? ({ '--cover': `url(${book.cover})` } as any)
                //         : {}
                // }
            >
                {(book.cover || !book.cover) && (
                    <div ref={wrapperRef} className={styles.bookWrapper}>
                        <svg >
                            <foreignObject x="0" y="0" width="100%" height="100%">
                                <div className={styles.title}>{book.title}</div>
                            </foreignObject>
                        </svg>
                        <svg >
                            <foreignObject x="0" y="50%" width="100%" height="100%">
                                <div className={styles.author}>{book.creator}</div>
                            </foreignObject>
                        </svg>
                    </div>
                )}
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
