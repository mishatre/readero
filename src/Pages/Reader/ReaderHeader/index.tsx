
import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

import { ReactComponent as CogIcon } from '../../../assets/icons/cog-solid.svg';
import { ReactComponent as AngleLeft } from '../../../assets/icons/angle-left-solid.svg';

import styles from './styles.module.scss';

interface IReaderHeaderProps {
    isPlaying: boolean;
    title: string;
}

const ReaderHeader = ({
    isPlaying,
    title,
}: IReaderHeaderProps) => {
    const history = useHistory();
    const goBack = useCallback(() => history.goBack(), [history]);
    return (
        <div className={styles.container}>
            <AngleLeft onClick={goBack} />
            <div className={styles.title}>{title}</div>
            <CogIcon />
        </div>
    );
}

export default ReaderHeader;