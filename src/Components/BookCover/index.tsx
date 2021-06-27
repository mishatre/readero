
import styles from './styles.module.scss';

interface IBookCoverProps {
    title: string;
    creator?: string;
    cover?: string;
}

const BookCover = ({ title, creator, cover }: IBookCoverProps) => {

    return (
        <div 
            className={styles.container}
            style={{
                '--imageOrColor': cover ? `url(${cover})` : '#995621',
            } as any}
        >
            <div className={styles.wrapper}>
                <div
                    className={styles.title}
                >
                    {title}
                </div>
                <div
                    className={styles.creator}
                >
                    {creator || ''}
                </div>
            </div>
        </div>
    );
}

export default BookCover;