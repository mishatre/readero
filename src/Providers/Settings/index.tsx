import createCtx from '../../utils/context';
import { useCallback, useEffect, useState } from 'react';

interface ISettingsProviderProps {
    children: React.ReactNode;
}

interface ISettingsContext {
    settings: ISettings;

    setWordsPerMinute: (newValue: number) => void;
    updateWordsPerMinute: (incValue: number) => void;

    setFont: (newValue: string) => void;
    setFontSize: (newValue: number) => void;
    setUseORP: (newValue: boolean) => void;
    setSlowDownOnLongWords: (newValue: boolean) => void;
}

export interface ISettings {
    font: string;
    fontSize: number;
    wordsPerMinute: number;
    useORP: boolean;
    slowDownOnLongWords: boolean;
}

const defaultSettings = {
    font: 'Kazemir',
    fontSize: 48,
    wordsPerMinute: 320,
    useORP: true,
    slowDownOnLongWords: true,
};

const [useSettingsContext, Provider] = createCtx<ISettingsContext>();

const SettingsProvider = ({ children }: ISettingsProviderProps) => {
    const [settings, setSettings] = useState<ISettings | null>(null);

    useEffect(() => {
        const settings: Partial<ISettings> = {};

        const {
            wordsPerMinute: defaultWordsPerMinute,
            ...defaultSettingsRest
        } = defaultSettings;

        const settingsString = localStorage.getItem('settings');
        if (!settingsString) {
            localStorage.setItem(
                'settings',
                JSON.stringify(defaultSettingsRest)
            );
            Object.assign(settings, defaultSettingsRest);
        } else {
            Object.assign(settings, JSON.parse(settingsString));
        }

        const wordsPerMinuteString = localStorage.getItem('wordsPerMinute');
        if (!wordsPerMinuteString) {
            localStorage.setItem(
                'wordsPerMinute',
                String(defaultWordsPerMinute)
            );
            settings.wordsPerMinute = defaultWordsPerMinute;
        } else {
            settings.wordsPerMinute = Number(wordsPerMinuteString);
        }

        setSettings(settings as ISettings);
    }, []);

    const setSetting = useCallback(
        <K extends keyof ISettings>(key: K, value: ISettings[K]) => {
            setSettings((currentSettings) => {
                if (!currentSettings) {
                    return null;
                }
                if (key === 'wordsPerMinute') {
                    localStorage.setItem('wordsPerMinute', String(value));
                } else {
                    localStorage.setItem(
                        'settings',
                        JSON.stringify({ ...currentSettings, [key]: value })
                    );
                }
                return { ...currentSettings, [key]: value };
            });
        },
        []
    );

    const setWordsPerMinute = useCallback(
        (newValue: number) => setSetting('wordsPerMinute', newValue),
        [setSetting]
    );
    const updateWordsPerMinute = useCallback(
        (incValue: number) =>
            setSetting(
                'wordsPerMinute',
                (settings?.wordsPerMinute || defaultSettings.wordsPerMinute) +
                    incValue
            ),
        [settings?.wordsPerMinute, setSetting]
    );

    const setFont = useCallback(
        (newValue: string) => setSetting('font', newValue),
        [setSetting]
    );
    const setFontSize = useCallback(
        (newValue: number) => setSetting('fontSize', newValue),
        [setSetting]
    );
    const setUseORP = useCallback(
        (newValue: boolean) => setSetting('useORP', newValue),
        [setSetting]
    );
    const setSlowDownOnLongWords = useCallback(
        (newValue: boolean) => setSetting('slowDownOnLongWords', newValue),
        [setSetting]
    );

    if (!settings) {
        return null;
    }

    return (
        <Provider
            value={{
                settings,
                setWordsPerMinute,
                updateWordsPerMinute,
                setFont,
                setFontSize,
                setUseORP,
                setSlowDownOnLongWords,
            }}
        >
            {children}
        </Provider>
    );
};

export { useSettingsContext };

export default SettingsProvider;
