
import styles from './styles.module.scss';

interface IHeaderProps {
    title: string;
}

const Header = ({ title }: IHeaderProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftButton}></div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rightButton}></div>
        </div>
    );
}

export default Header;