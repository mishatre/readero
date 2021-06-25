import clamp from "../../../utils/clamp";
import { timestampToHumanTime } from "../../../utils/time";
import styles from './styles.module.scss';

interface IStatusPanelProps {
    position: number;
    timeLeft: number;
    wordsLeft: number
}

interface IStatusBarStyleProps extends React.CSSProperties {
    '--position': string;
}

const StatusPanel = ({
    position,
    timeLeft,
    wordsLeft,
}: IStatusPanelProps) => {

    return (
        <div className={styles.container}>
            <div
                className={styles.statusBar}
                style={{
                    '--position': `${clamp(0, position, 100)}%`
                } as IStatusBarStyleProps}
            />
            <div className={styles.bottomBar}>
                <span className={styles.timeLeft}>{timestampToHumanTime(timeLeft)}</span>
                <span className={styles.wordsLeft}>{wordsLeft} word{wordsLeft > 1 ? 's' : ''} left</span>
            </div>
            
        </div>
    );
}

export default StatusPanel;