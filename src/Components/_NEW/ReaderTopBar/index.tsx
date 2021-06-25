
import cn from 'classnames';

import { ReactComponent as AngleLeftIcon } from '../../../assets/icons/angle-left-solid.svg';
import { ReactComponent as FontIcon } from '../../../assets/icons/font-icon.svg';
import { ReactComponent as TextIcon } from '../../../assets/icons/text-icon.svg';
import { ReactComponent as GuidelineIcon } from '../../../assets/icons/guideline-icon.svg';
import styles from './styles.module.scss';

interface IReaderTopBarProps {
    onGoBack?: () => void;
    onFontClick?: () => void;
    onORPClick?: () => void;
    onORPGuidelineClick?: () => void;
}

const ReaderTopBar = ({
    onGoBack,
    onFontClick,
    onORPClick,
    onORPGuidelineClick
}: IReaderTopBarProps) => {
    return (
        <div className={styles.container}>
            <div className={cn(styles.button, styles.backButton)} onClick={onGoBack}>
                <AngleLeftIcon />
            </div>
            <div className={styles.buttons}>
                <div 
                    className={cn(styles.button)}
                    onClick={onFontClick}
                >
                    <FontIcon />
                </div>
                <div 
                    className={cn(styles.button)}
                    onClick={onORPClick}
                >
                    <TextIcon />
                </div>
                <div 
                    className={cn(styles.button)}
                    onClick={onORPGuidelineClick}
                >
                    <GuidelineIcon />
                </div>
            </div>
        </div>
    );
}

export default ReaderTopBar;