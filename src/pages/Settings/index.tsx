import Header from './Header';
import styles from './styles.module.scss';

import { ReactComponent as MinusSmallIcon } from 'assets/icons/minus-small.svg';
import { ReactComponent as PlusSmallIcon } from 'assets/icons/plus-small.svg';

import cn from 'classnames';
import { useSettings } from 'providers/Settings';
import { useCallback } from 'react';
import Menu from 'components/Menu';
import clamp from 'utils/clamp';

interface ISettingsProps { }

function CheckBox({
    active,
    onClick,
}: {
    active: boolean;
    onClick: () => void;
}) {
    return (
        <div
            className={cn(styles.checkbox, { [styles.active]: active })}
            onClick={onClick}
        />
    );
}

function Item({ title, value }: { title: string; value: string }) {
    return (
        <div className={styles.item}>
            <div>{title}</div>
            <div>{value}</div>
        </div>
    );
}

function ItemCheckbox({
    title,
    onClick,
    value,
}: {
    title: string;
    value: boolean;
    onClick: () => void;
}) {
    return (
        <div className={styles.item}>
            <div>{title}</div>
            <div>
                <CheckBox active={value} onClick={onClick} />
            </div>
        </div>
    );
}

function ItemRange({
    title,
    onChange,
    value,
    min = 0,
    max = 100,
}: {
    title: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (number: number) => void;
}) {
    return (
        <div className={cn(styles.item, styles.range)}>
            <div>{title}</div>
            <div className={styles.range}>
                <div className={styles.value}>{value} px</div>
                <div className={styles.incButtons}>
                    <div
                        className={styles.button}
                        onClick={() => onChange(clamp(min, value - 2, max))}
                    >
                        <MinusSmallIcon />
                    </div>
                    <div
                        className={styles.button}
                        onClick={() => onChange(clamp(min, value + 2, max))}
                    >
                        <PlusSmallIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ItemGroup({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={styles.category}>
            {title && <div className={styles.categoryTitle}>{title}</div>}
            {children}
        </div>
    );
}

// eslint-disable-next-line no-empty-pattern
const Settings = ({ }: ISettingsProps) => {
    const { settings, set } = useSettings();
    const toggleORP = useCallback(() => set('ORP', (v) => !v), [set]);
    const toggleORPGuideline = useCallback(
        () => set('ORPGuideLine', (v) => !v),
        [set]
    );
    const toggleSlowDown = useCallback(
        () => set('slowDownOnLongWords', (v) => !v),
        [set]
    );
    const toggleShowPreviousOnPause = useCallback(
        () => set('showPreviousOnPause', (v) => !v),
        [set]
    );
    const setRenderType = useCallback((value) => set('renderType', value), [set]);
    return (
        <div className={styles.container}>
            <Header title="Settings" />
            <div className={styles.settings}>
                <ItemGroup title="Book Reader">
                    <Item
                        title="Font family"
                        value={settings.fontFamilyReader}
                    />
                    <ItemRange
                        title="Font size"
                        value={settings.fontSizeReader}
                        min={8}
                        max={24}
                        onChange={(value) => {
                            set('fontSizeReader', value);
                        }}
                    />
                </ItemGroup>
                <ItemGroup title="RSVP Reader">
                    <Item title="Font family" value={settings.fontFamilyRSVP} />
                    <ItemRange
                        title="Font size"
                        value={settings.fontSizeRSVP}
                        min={24}
                        max={48}
                        onChange={(value) => {
                            set('fontSizeRSVP', value);
                        }}
                    />
                </ItemGroup>
                <ItemGroup title="RSVP Reader type">
                    <ItemCheckbox
                        title="Optimal recognition point"
                        value={settings.renderType === 'ORP'}
                        onClick={() => setRenderType('ORP')}
                    />
                    <ItemCheckbox
                        title="Text middle point"
                        value={settings.renderType === 'middle'}
                        onClick={() => setRenderType('middle')}
                    />
                </ItemGroup>
                {settings.renderType === 'ORP' &&
                    <ItemGroup title="ORP features">
                        <ItemCheckbox
                            title="Show optimal recognition point"
                            value={settings.ORP}
                            onClick={toggleORP}
                        />
                        <ItemCheckbox
                            title="Show ORP guideline"
                            value={settings.ORPGuideLine}
                            onClick={toggleORPGuideline}
                        />
                    </ItemGroup>
                }
                {settings.renderType === 'middle' &&
                    <ItemGroup title="Middle point features">
                        <ItemCheckbox
                            title="Highlight text center"
                            value={settings.ORP}
                            onClick={toggleORP}
                        />
                    </ItemGroup>
                }
                <ItemGroup title="RSVP Reader general features">
                    <ItemCheckbox
                        title="Slow down on long words"
                        value={settings.slowDownOnLongWords}
                        onClick={toggleSlowDown}
                    />
                    <ItemCheckbox
                        title="Show 50 previous words on pause"
                        value={settings.showPreviousOnPause}
                        onClick={toggleShowPreviousOnPause}
                    />
                </ItemGroup>
                <ItemGroup >
                    <ItemCheckbox
                        title="Show forward/backward buttons"
                        value={false}
                        onClick={() => { }}
                    />
                </ItemGroup>
            </div>
            <Menu />
        </div>
    );
};

export default Settings;
