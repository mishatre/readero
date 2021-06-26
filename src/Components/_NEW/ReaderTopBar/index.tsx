import cn from 'classnames';

import { ReactComponent as AngleLeftIcon } from '../../../assets/icons/angle-left-solid.svg';
import { ReactComponent as FontIcon } from '../../../assets/icons/font-icon.svg';
import { ReactComponent as TextIcon } from '../../../assets/icons/text-icon.svg';
import { ReactComponent as GuidelineIcon } from '../../../assets/icons/guideline-icon.svg';
import styles from './styles.module.scss';
import { useSettings } from '../../../Providers/Settings';
import { memo } from 'react';

interface IReaderTopBarProps {
    title: string;
    mode: 'view' | 'play' | 'pause';
    hide: boolean;
    onGoBack?: () => void;
    onFontClick?: () => void;
}

const ReaderTopBar = ({
    title,
    mode,
    hide,
    onGoBack,
    onFontClick,
}: IReaderTopBarProps) => {
    const { settings, set } = useSettings();

    return (
        <div className={cn(styles.container, { [styles.hidden]: hide })}>
            <div
                className={cn(styles.button, styles.backButton)}
                onClick={onGoBack}
            >
                <AngleLeftIcon />
            </div>
            {mode === 'view' && <div className={styles.title}>{title}</div>}
            {mode !== 'view' && (
                <div className={styles.buttons}>
                    <div className={cn(styles.button)} onClick={onFontClick}>
                        <FontIcon />
                    </div>
                    <div
                        className={cn(styles.button)}
                        onClick={() => set('ORP', (v) => !v)}
                    >
                        <TextIcon />
                    </div>
                    <div
                        className={cn(styles.button)}
                        onClick={() => set('ORPGuideLine', (v) => !v)}
                    >
                        <GuidelineIcon />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(ReaderTopBar);
