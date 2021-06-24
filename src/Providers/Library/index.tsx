import createCtx from '../../utils/context';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';
import epubToTxt from '../../Libraries/epubToTxt';

interface ILibraryProviderProps {
    children: React.ReactNode;
}

interface ILibraryRecord {
    id: string;
    title: string;
    creator?: string;
}

export interface IBookInfo {    
    id: string;
    title: string;
    creator: string;
    cover: boolean;

    words: number;
    sentences: number;

}

interface ILibraryContext {

    library: IBookInfo[];

    loadBook: (file: Blob) => void;
    removeBook: (id: string) => void;

    getBookContent: (id: string) => Promise<{
        info: IBookInfo;
        content: string;
        currentWordIndex: number;
    }>;

    saveCurrentWordIndex: (id: string, index: number) => void;
}

const [useLibraryContext, Provider] = createCtx<ILibraryContext>();

const LibraryProvider = ({ children }: ILibraryProviderProps) => {

    const [library, setLibrary] = useState<IBookInfo[] | null>();

    useEffect(() => {
        (async () => {
            const data = await localforage.getItem<ILibraryRecord[]>('library');
            setLibrary(data as any || []);

            for (let item of (data || []) as any) {
                const coverBlob = await localforage.getItem(`${item.id}_cover`);
                if (coverBlob) {
                    (item as any).cover = URL.createObjectURL(coverBlob);
                }
            }
        
            
        })();
    }, []);

    const bookExists = useCallback((id: string) => {
        if(!library) {
            return false;
        }
        return !!library.find((item) => item.id === id);
    }, [library]);

    //
    const loadBook = useCallback(async (file: Blob) => {

        try {
            const parsedEpub = await epubToTxt(file);

            // if (!parsedEpub.metadata.id) {
            //     return;
            // }

            // if (bookExists(parsedEpub.metadata.id)) {
            //     console.log('Book already exist');
            //     return;
            // }

            // const { content, cover, ...info } = bookInfo;
            // setLibrary([...library, { ...info, cover }]);
            // await localforage.setItem('library', [...library, info]);

            // await localforage.setItem(bookInfo.id, content);
            // if (cover) {
            //     const coverFetchResponse = await fetch(cover);
            //     const coverBlob = await coverFetchResponse.blob();
            //     await localforage.setItem(`${bookInfo.id}_cover`, coverBlob);
            // }

        } catch(error) {
            console.log(error);
        }
    }, [library]);

    const removeBook = useCallback((id: string) => {}, []);

    const getBookContent = useCallback(
        async (id: string) => {
            const content = (await localforage.getItem(id)) as string;
            const info = library!.find((item) => item.id === id)!;

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

    if(!library) {
        return null;
    }

    return (
        <Provider
            value={{

                library,

                loadBook,
                removeBook,

                getBookContent,

                saveCurrentWordIndex,
            }}
        >
            {children}
        </Provider>
    );
};

export { useLibraryContext };

export default LibraryProvider;
