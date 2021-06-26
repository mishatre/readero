
import styles from './styles.module.scss';
import { ReactComponent as PlusIcon } from 'assets/icons/plus-solid.svg'; 

interface IAppHeaderProps {
    title: string;
    editMode?: boolean;
    onBookAdd?: () => void;
    onEdit?: () => void;
}

const AppHeader = ({ title, onBookAdd }: IAppHeaderProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftButton} onClick={onBookAdd}>
                <PlusIcon/>
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rightButton}>Edit</div>
        </div>
    );
}

export default AppHeader;