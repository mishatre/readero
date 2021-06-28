
import styles from './styles.module.scss';

import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left-solid.svg';

interface IHeaderProps {
    title?: string;
    onBackButton: () => void;
}

const Header = ({ title, onBackButton }: IHeaderProps) => {
    return (
        <div className={styles.container}>
            <div
                className={styles.button}
                onClick={onBackButton}
            >
                <AngleLeftIcon />
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rightButton}></div>
        </div>
    );
}

export default Header;