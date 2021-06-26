
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles.module.scss';

interface IMenuProps {

}

// eslint-disable-next-line no-empty-pattern
const Menu = ({}: IMenuProps) => {
    const location = useLocation();
    return (
        <div className={styles.container}>
            <Link
                to="/" 
                className={cn(styles.item, { 
                    [styles.selected]: location.pathname === '/'
                })}
            >
                Library
            </Link>
            <Link
                to="/settings"
                className={cn(styles.item, { 
                    [styles.selected]: location.pathname === '/settings'
                })}
            >
                Settings
            </Link>
        </div>
    );
}

export default Menu;