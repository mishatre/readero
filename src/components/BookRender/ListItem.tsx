
import cn from 'classnames';
import { useBookRendererContext } from './context';
import styles from './styles.module.scss';

interface IListItemProps {
    style: React.CSSProperties;
    index: number;
}

const ListItem = ({ style, index }: IListItemProps) => {

    const { words, rows, currentIndex, onRowClick } = useBookRendererContext();

    let rowIndex = -1;
    let colIndex = -1;

    if (!rows[index + 1] || currentIndex < rows[index + 1].index) {
        rowIndex = index;
        colIndex = currentIndex - rows[index].index;
    }

    const row = words.slice(rows[index].startIndex, rows[index].endIndex);

    return (
        <div className={styles.item} style={style}>
            <div className={styles.row}>
                {row.map((item, wordIndex) => (
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
                ))}
            </div>
        </div>
    );
}

export default ListItem;