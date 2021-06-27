import cn from 'classnames';
import { Link } from 'react-router-dom';
// import { timeToRead, completionRate } from '../../utils/wordTime';
import { ReactComponent as RestIcon } from 'assets/icons/rest.svg';
import styles from './styles.module.scss';

import { IBookInfo } from 'Providers/Library';
import { useRef } from 'react';
import { timestampToHumanTime } from 'utils/time';

interface IBookProps {
    book: IBookInfo;
    currentWord: number;
    wordsPerMinute: number;
    onClick: (id: string) => void;
}

function Book({ book, currentWord, wordsPerMinute, onClick }: IBookProps) {

    const wrapperRef = useRef<HTMLDivElement>(null);

    const position = Math.floor((100 / book.totalWords) * currentWord);
    const timeToRead =
        Math.floor((book.totalWords - currentWord) / (wordsPerMinute / 60)) * 1000;

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
                    {position !== 100
                        ? `${position} %`
                        : 'FINISHED'}
                </div>
                <div> {timestampToHumanTime(timeToRead)}</div>
                <div>
                    <RestIcon />
                </div>
            </div>
        </Link>
    );
}

export default Book;
