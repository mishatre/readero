import LogoIconSrc from 'assets/logo.png';

import styles from './styles.module.scss';

interface ILoadingScreenProps {}

// eslint-disable-next-line no-empty-pattern
const LoadingScreen = ({}: ILoadingScreenProps) => {
    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${LogoIconSrc})`,
            }}
        ></div>
    );
};

export default LoadingScreen;
