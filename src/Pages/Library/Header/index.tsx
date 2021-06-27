
import cn from 'classnames';

import styles from './styles.module.scss';
import { ReactComponent as PlusIcon } from 'assets/icons/plus-solid.svg'; 

interface IHeaderProps {
    title: string;
    editMode: boolean;
    onBookAdd: () => void;
    onEdit: () => void;

    onSelectAll: () => void;
    onDone: () => void;
}

const Header = ({ title, editMode, onBookAdd, onEdit, onSelectAll, onDone }: IHeaderProps) => {
    return (
        <div className={styles.container}>
            {!editMode && <div className={styles.leftButton} onClick={onBookAdd}><PlusIcon/></div>}
            {editMode && <div className={cn(styles.leftButton, styles.selectAllButton)} onClick={onSelectAll}>Select All</div>}
            <div className={styles.title}>{title}</div>
            {!editMode && <div className={styles.leftButton} onClick={onEdit}>Edit</div>}
            {editMode && <div className={styles.leftButton} onClick={onDone}>Done</div>}
        </div>
    );
}

export default Header;