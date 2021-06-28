
import Menu from 'components/Menu';
import Header from './Header';
import styles from './styles.module.scss';

interface IStatisticsProps {

}

// eslint-disable-next-line no-empty-pattern
const Statistics = ({}: IStatisticsProps) => {
    return (
        <div className={styles.container}>
            <Header title="Statistics"/>
            <div>

            </div>
            <Menu />
        </div>
    )
};

export default Statistics;