
import cn from 'classnames';
import styles from './styles.module.scss';

interface IORPGuidelineProps {
    visible: boolean;
    children: React.ReactNode;
}

const ORPGuideline = ({ visible, children }: IORPGuidelineProps) => {
    return (
        <div className={cn(styles.ORPGuideline, { [styles.disabled]: !visible })}>
            <div className={styles.topLine}/>
            {children}
            <div className={styles.bottomLine}/>
        </div>
    )
}

export default ORPGuideline;