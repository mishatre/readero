import createCtx from '../../utils/context';
import { useCallback, useEffect, useState } from 'react';

type SetStateAction<S> = S | ((prevState: S) => S);

interface ISettingsProviderProps {
    children: React.ReactNode;
}

interface ISettingsContext {
    settings: ISettings;
    set: <K extends keyof ISettings>(
        key: K,
        value: SetStateAction<ISettings[K]>
    ) => void;
}

export interface ISettings {
    fontFamily: string;
    fontSize: number;
    wordsPerMinute: number;
    ORP: boolean;
    ORPGuideLine: boolean;
    slowDownOnLongWords: boolean;
}

const settingsList = [
    'fontFamily',
    'fontSize',
    'wordsPerMinute',
    'ORP',
    'ORPGuideLine',
    'slowDownOnLongWords',
] as const;

// const fontSettings = {
//     fontFamily: 'Liberation Mono',
//     fontSizeRSVP: 48,
//     fontSizeReader: 16,
//     linHeight: 'normal',
// }

const defaultSettings = {
    fontFamily: 'Consolas',
    fontSize: 48,
    wordsPerMinute: 320,
    ORP: true,
    ORPGuideLine: true,
    slowDownOnLongWords: true,
};

const [useSettings, Provider] = createCtx<ISettingsContext>();

const SettingsProvider = ({ children }: ISettingsProviderProps) => {
    const [settings, setSettings] = useState<ISettings | null>(null);

    useEffect(() => {
        const settings = defaultSettings;
        for (const key of settingsList) {
            const jsonValue = localStorage.getItem(key);
            if (jsonValue) {
                (settings[key] as ISettings[typeof key]) = JSON.parse(
                    jsonValue
                ).value;
            }
        }
        setSettings(settings);
    }, []);

    const set = useCallback(
        <K extends keyof ISettings>(
            key: K,
            value: SetStateAction<ISettings[K]>
        ) => {
            setSettings((prevValue) => {
                if (!prevValue) {
                    return null;
                }
                const nextValue =
                    typeof value === 'function' ? value(prevValue[key]) : value;
                localStorage.setItem(key, JSON.stringify({ value: nextValue }));
                return { ...prevValue, [key]: nextValue };
            });
        },
        []
    );

    if (!settings) {
        return null;
    }

    return (
        <Provider
            value={{
                settings,
                set,
            }}
        >
            {children}
        </Provider>
    );
};

export { useSettings };

export default SettingsProvider;
