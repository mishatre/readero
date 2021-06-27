
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as LibraryIcon } from 'assets/icons/library.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg';
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
                <LibraryIcon />
                Library
            </Link>
            <Link
                to="/settings"
                className={cn(styles.item, { 
                    [styles.selected]: location.pathname === '/settings'
                })}
            >
                <SettingsIcon/>
                Settings
            </Link>
        </div>
    );
}

export default Menu;