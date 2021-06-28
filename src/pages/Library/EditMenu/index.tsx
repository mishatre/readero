
import cn from 'classnames';
import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';

import styles from './styles.module.scss';

interface IEditMenuProps {
    active: boolean;
    onDelete: () => void;
}

const EditMenu = ({ active, onDelete }: IEditMenuProps) => {
    return (
        <div className={cn(styles.container, { [styles.active]: active })}>
            <div className={styles.item} onClick={onDelete}>
                <TrashIcon />
            </div>
        </div>
    );
}

export default EditMenu;