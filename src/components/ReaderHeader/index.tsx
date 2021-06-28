
import { memo } from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left-solid.svg';
import { ReactComponent as FontIcon } from 'assets/icons/font-icon.svg';
import { ReactComponent as TextIcon } from 'assets/icons/text-icon.svg';
import { ReactComponent as GuidelineIcon } from 'assets/icons/guideline-icon.svg';

interface IReaderHeaderProps {
    title: string;
    mode: 'view' | 'play' | 'pause';
    hidden: boolean;
    onBackButton: () => void,
    onChangeFont: () => void;
    onSetORP: () => void;
    onSetORPGuidelines: () => void;
}

const ReaderHeader = ({
    title,
    mode,
    hidden,
    onBackButton,
    onChangeFont,
    onSetORP,
    onSetORPGuidelines
}: IReaderHeaderProps) => {

    return (
        <div 
            className={cn(styles.container, { 
                [styles.hidden]: hidden 
            })}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className={styles.button}
                onClick={onBackButton}
            >
                <AngleLeftIcon />
            </div>
            {mode === 'view' && <span className={styles.title}>{title}</span>}
            <div className={styles.buttons}>
                {mode !== 'view' && (
                    <>
                        <div className={cn(styles.button)} onClick={onChangeFont}>
                            <FontIcon />
                        </div>
                        <div
                            className={cn(styles.button)}
                            onClick={onSetORP}
                        >
                            <TextIcon />
                        </div>
                        <div
                            className={cn(styles.button)}
                            onClick={onSetORPGuidelines}
                        >
                            <GuidelineIcon />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(ReaderHeader);
