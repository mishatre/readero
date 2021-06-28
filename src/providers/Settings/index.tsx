import createCtx from '../../utils/context';
import { useCallback, useEffect, useState } from 'react';
import { IFontInfo } from 'types/fontInfo';
import useFontWidth from 'hooks/useFontWidth';

type SetStateAction<S> = S | ((prevState: S) => S);

interface ISettingsProviderProps {
    children: React.ReactNode;
}

interface ISettingsContext {
    settings: ISettings;
    readerFontInfo: IFontInfo;
    rsvpFontInfo: IFontInfo;
    fontWidth: number;
    set: <K extends keyof ISettings>(
        key: K,
        value: SetStateAction<ISettings[K]>
    ) => void;
}

export interface ISettings {
    fontFamilyRSVP: string;
    fontFamilyReader: string;
    fontSizeRSVP: number;
    fontSizeReader: number;
    wordsPerMinute: number;
    ORP: boolean;
    ORPGuideLine: boolean;
    slowDownOnLongWords: boolean;
    showPreviousOnPause: boolean;
}

const settingsList = [
    'fontFamilyRSVP',
    'fontFamilyReader',
    'fontSizeRSVP',
    'fontSizeReader',
    'wordsPerMinute',
    'ORP',
    'ORPGuideLine',
    'slowDownOnLongWords',
    'showPreviousOnPause',
] as const;

// const fontSettings = {
//     fontFamily: 'Liberation Mono',
//     fontSizeRSVP: 48,
//     fontSizeReader: 16,
//     linHeight: 'normal',
// }

const defaultSettings = {
    fontFamilyRSVP: 'SFMono',
    fontFamilyReader: 'Liberation Mono',
    fontSizeRSVP: 32,
    fontSizeReader: 16,
    wordsPerMinute: 320,
    ORP: true,
    ORPGuideLine: true,
    slowDownOnLongWords: true,
    showPreviousOnPause: true,
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

    const fontWidth = useFontWidth(
        settings?.fontFamilyReader,
        settings?.fontSizeReader
    );

    if (!settings) {
        return null;
    }

    const readerFontInfo = {
        fontFamily: settings.fontFamilyReader,
        fontSize: settings.fontSizeReader,
        fontWeight: 'normal',
        lineHeight: 17,
    };

    const rsvpFontInfo = {
        fontFamily: settings.fontFamilyRSVP,
        fontSize: settings.fontSizeRSVP,
        fontWeight: 'normal',
        lineHeight: 17,
    };

    return (
        <Provider
            value={{
                settings,
                readerFontInfo,
                rsvpFontInfo,
                fontWidth,
                set,
            }}
        >
            {children}
        </Provider>
    );
};

export { useSettings };

export default SettingsProvider;
