
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles.module.scss';

interface IMenuProps {

}

const Menu = ({}: IMenuProps) => {
    const location = useLocation();
    console.log(location)
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