
import cn from 'classnames';

import BookCover from "Components/BookCover";
import { IBookInfo } from "Providers/Library";

import { ReactComponent as RestIcon } from 'assets/icons/rest.svg';

import styles from './styles.module.scss';
import { timestampToHumanTime } from 'utils/time';

interface IBookItemProps {
    bookInfo: IBookInfo;
    currentWord: number;
    wordsPerMinute: number;
    selectable?: boolean;
    selected?: boolean;

    onBookClick: (id: string) => void;
    onRestClick: (id: string) => void;
}

const BookItem = ({
    bookInfo,
    currentWord,
    wordsPerMinute,
    selectable = false,
    selected = false,
    onBookClick,
    onRestClick,
}: IBookItemProps) => {

    const position = Math.floor((100 / bookInfo.totalWords) * currentWord);
    const timeToRead =
        Math.floor((bookInfo.totalWords - currentWord) / (wordsPerMinute / 60)) * 1000;

    return (
        <div 
            className={cn(styles.container, { 
                [styles.selectable]: selectable,
                [styles.selected]: selected,
            })}
        >
            <div className={styles.wrapper}>
                <div className={styles.book} onClick={() => onBookClick(bookInfo.id)}>
                    <BookCover 
                        title={bookInfo.title} 
                        creator={bookInfo.creator} 
                        cover={bookInfo.cover ? (bookInfo.cover as string) : undefined } 
                    />
                </div>
                <div className={styles.bottom}>
                    <div>
                        {position !== 100
                            ? `${position} %`
                            : 'FINISHED'}
                    </div>
                    <div> {timestampToHumanTime(timeToRead)}</div>
                    <div onClick={() => onRestClick(bookInfo.id)}>
                        <RestIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookItem;