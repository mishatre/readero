
import Header from './Header';
import styles from './styles.module.scss';

import { ReactComponent as MinusSmallIcon } from 'assets/icons/minus-small.svg';
import { ReactComponent as PlusSmallIcon } from 'assets/icons/plus-small.svg';

import cn from 'classnames';
import { useSettings } from 'Providers/Settings';
import { useCallback } from 'react';
import { clamp } from 'lodash';

interface ISettingsProps {

}

function CheckBox({ active, onClick }: { active: boolean, onClick: () => void }) {
    return (
        <div 
            className={cn(styles.checkbox, { [styles.active]: active})} 
            onClick={onClick}
        />
    )
}

function Item({ title, value }: { title: string, value: string }) {
    return (
        <div className={styles.item}>
            <div>
                {title}
            </div>
            <div>
                {value}
            </div>
        </div>
    )
}

function ItemCheckbox({ title, onClick, value }: { title: string, value: boolean; onClick: () => void }) {
    return (
        <div className={styles.item}>
            <div>
                {title}
            </div>
            <div>
                <CheckBox active={value} onClick={onClick} />
            </div>
        </div>
    )
}

function ItemRange({ title, onChange, value, min = 0, max = 100 }: { 
    title: string, 
    value: number; 
    min?: number;
    max?: number;
    onChange: (number: number) => void 
}) {
    return (
        <div className={cn(styles.item, styles.range)}>
            <div>
                {title}
            </div>
            <div className={styles.range}>
                <div className={styles.value}>
                    {value} px
                </div>
                <div className={styles.incButtons}>
                    <div 
                        className={styles.button} 
                        onClick={() => onChange(clamp(min, value-2, max))}
                    >
                        <MinusSmallIcon />
                    </div>
                    <div 
                        className={styles.button}
                        onClick={() => onChange(clamp(min, value+2, max))}
                    >
                        <PlusSmallIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ItemGroup({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div className={styles.category}>
            {title && <div className={styles.categoryTitle}>{title}</div>}
            {children}
        </div>
    )
}

// eslint-disable-next-line no-empty-pattern
const Settings = ({}: ISettingsProps) => {

    const { settings, set } = useSettings();
    const toggleORP = useCallback(() => set('ORP', v => !v), [set]);
    const toggleORPGuideline = useCallback(() => set('ORPGuideLine', v => !v), [set]);
    const toggleSlowDown = useCallback(() => set('slowDownOnLongWords', v => !v), [set]);
    const toggleShowPreviousOnPause = useCallback(() => set('showPreviousOnPause', v => !v), [set]);
    return (
        <div className={styles.container}>
            <Header title="Settings" />
            <div className={styles.settings}>
                <ItemGroup title="Book Reader">
                    <Item title="Font family" value={settings.fontFamilyReader} />
                    <ItemRange 
                        title="Font size" 
                        value={settings.fontSizeReader} 
                        min={8}
                        max={24}
                        onChange={(value) => {set('fontSizeReader', value)}}
                    />
                </ItemGroup>
                <ItemGroup title="RSVP Reader">
                    <Item title="Font family" value={settings.fontFamilyRSVP} />
                    <ItemRange 
                        title="Font size" 
                        value={settings.fontSizeRSVP} 
                        min={24}
                        max={48}
                        onChange={(value) => {set('fontSizeRSVP', value)}}
                    />
                    <ItemCheckbox title="Show optimal recognition point" value={settings.ORP} onClick={toggleORP} />
                    <ItemCheckbox title="Show ORP guideline" value={settings.ORPGuideLine} onClick={toggleORPGuideline} />
                    <ItemCheckbox title="Slow down on long words" value={settings.slowDownOnLongWords} onClick={toggleSlowDown} />
                    <ItemCheckbox title="Show 50 previous words on pause" value={settings.showPreviousOnPause} onClick={toggleShowPreviousOnPause} />
                    
                </ItemGroup>
            </div>
        </div>
    );
}

export default Settings;