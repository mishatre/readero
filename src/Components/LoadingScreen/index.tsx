
import LogoIconSrc from 'assets/logo.png';

import styles from './styles.module.scss';

interface ILoadingScreenProps {

}

const LoadingScreen = ({ }: ILoadingScreenProps) => {
    return (
        <div className={styles.container} style={{
            backgroundImage: `url(${LogoIconSrc})`
        }}>

        </div>
    )
}

export default LoadingScreen;