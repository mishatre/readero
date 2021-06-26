
import Header from './Header';
import styles from './styles.module.scss';

interface ISettingsProps {

}

const Settings = ({}: ISettingsProps) => {
    return (
        <div className={styles.container}>
            <Header title="Settings" />
            <div>
                
            </div>
        </div>
    );
}

export default Settings;