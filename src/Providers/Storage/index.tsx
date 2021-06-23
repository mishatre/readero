import createCtx from '../../utils/context';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';

interface IStorageProviderProps {
    children: React.ReactNode;
}

export interface IStorageSettings {
    font: string;
    fontSize: number;
    wordsPerMinute: number;
}

export interface IBookInfo {
    id: string;
    title: string;
    author: string;

    cover?: string;
}

interface IBook {
    id: string;
    title: string;
    author: string;
    cover?: string;
    ttc?: string;
    completed?: number;
}

interface IStorageContext {
    loaded: boolean;

    library: IBookInfo[];
    settings: IStorageSettings;

    addBook: (bookInfo: any) => void;
    removeBook: (id: string) => void;

    getBookContent: (id: string) => Promise<{
        info: IBookInfo;
        content: string;
        currentWordIndex: number;
    }>;

    saveCurrentWordIndex: (id: string, index: number) => void;
}

const defaultSettings = {
    font: 'Helvetica',
    fontSize: 16,
    wordsPerMinute: 320,
};

const [useStorageContext, Provider] = createCtx<IStorageContext>();

const StorageProvider = ({ children }: IStorageProviderProps) => {
    const [loaded, setLoaded] = useState(false);
    const [settings, setSettings] = useState<IStorageSettings>(defaultSettings);
    const [library, setLibrary] = useState<IBookInfo[]>([]);

    const loadSettings = useCallback(async () => {
        const data = await localforage.getItem('settings');
        if (!data) {
            await localforage.setItem('settings', defaultSettings);
            setSettings(defaultSettings);
        } else {
            setSettings(data as IStorageSettings);
        }
    }, []);

    const loadLibrary = useCallback(async () => {
        const data = await localforage.getItem('library');
        setLibrary((data as any) || []);
        setLoaded(true);
    }, []);

    //
    const addBook = useCallback(
        async (bookInfo: any) => {
            const bookExist = library.find((item) => item.id === bookInfo.id);
            if (bookExist) {
                console.log('Book already exist');
                return;
            }

            const { content, cover, ...info } = bookInfo;

            const updatedLibrary = [...library, info];
            await localforage.setItem('library', updatedLibrary);
            setLibrary(updatedLibrary);

            await localforage.setItem(bookInfo.id, content);
        },
        [library]
    );
    const removeBook = useCallback((id: string) => {}, []);

    const getBookContent = useCallback(
        async (id: string) => {
            const content = (await localforage.getItem(id)) as string;
            const info = library.find((item) => item.id === id)!;

            const currentWordIndex = (await getCurrentWordIndex(id)) || 0;

            return {
                info,
                content,
                currentWordIndex,
            };
        },
        [library]
    );

    const getCurrentWordIndex = useCallback((id: string) => {
        return localforage.getItem(`${id}_index`) as unknown as number;
    }, []);

    const saveCurrentWordIndex = useCallback((id: string, index: number) => {
        localforage.setItem(`${id}_index`, index);
    }, []);

    useEffect(() => {
        loadSettings();
        loadLibrary();
    }, [loadSettings, loadLibrary]);

    return (
        <Provider
            value={{
                loaded,

                library,
                settings,

                addBook,
                removeBook,

                getBookContent,

                saveCurrentWordIndex,
            }}
        >
            {children}
        </Provider>
    );
};

export { useStorageContext };

export default StorageProvider;
