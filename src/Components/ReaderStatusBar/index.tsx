import cn from 'classnames';
import { useSettings } from 'Providers/Settings';

import clamp from 'utils/clamp';
import { timestampToHumanTime } from 'utils/time';
import styles from './styles.module.scss';

interface IReaderStatusBarProps {
    mode: 'view' | 'play' | 'pause';
    hidden: boolean;
    totalWords: number;
    currentWord: number;
}

interface IReaderStatusBarStyleProps extends React.CSSProperties {
    '--position': string;
}

const ReaderStatusBar = ({
    mode,
    hidden,
    totalWords,
    currentWord,
}: IReaderStatusBarProps) => {
    const {
        settings: { wordsPerMinute },
    } = useSettings();

    const timeToRead =
        Math.floor((totalWords - currentWord) / (wordsPerMinute / 60)) * 1000;

    const position = (100 / totalWords) * currentWord;
    const wordsLeft = totalWords - currentWord;

    return (
        <div className={cn(styles.container, { [styles.hidden]: hidden, [styles.playing]: mode !== 'view' })}>
            <div
                className={styles.statusBar}
                style={
                    {
                        '--position': `${clamp(0, position, 100)}%`,
                    } as IReaderStatusBarStyleProps
                }
            />
            <div className={styles.bottomBar}>
                <span className={styles.timeLeft}>
                    {timestampToHumanTime(timeToRead)}
                </span>
                <span className={styles.wordsLeft}>
                    {wordsLeft} word{wordsLeft > 1 ? 's' : ''} left
                </span>
            </div>
        </div>
    );
};

export default ReaderStatusBar;
