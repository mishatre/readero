
import cn from 'classnames';
import { useBookRendererContext } from './context';
import styles from './styles.module.scss';

interface IListItemProps {
    style: React.CSSProperties;
    index: number;
}

const ListItem = ({ style, index }: IListItemProps) => {

    const { words, paragraphs, currentIndex, onRowClick } = useBookRendererContext();

    const [startIndex, items] = paragraphs[index];

    let rowIndex = -1;
    let colIndex = -1;

    if (!paragraphs[index + 1] || currentIndex < paragraphs[index + 1][0]) {
        rowIndex = index;
        colIndex = currentIndex - paragraphs[index][0];
    }

    const row = words.slice(startIndex, startIndex + items.length).join(' ');// index === rowIndex ? words.slice(startIndex, startIndex + items.length).join(' ') : '';

    return (
        <div className={styles.item} style={style}>
            <div className={styles.row}>
                {row}
                {/* {row.map((item, wordIndex) => (
                    <span
                        key={(index + 1) * wordIndex}
                        onClick={() => onRowClick(index, wordIndex)}
                        className={cn({
                            [styles.selected]:
                                index === rowIndex &&
                                wordIndex === colIndex,
                        })}
                    >
                        {' ' + item + ' '}
                    </span>
                ))} */}
            </div>
        </div>
    );
}

export default ListItem;