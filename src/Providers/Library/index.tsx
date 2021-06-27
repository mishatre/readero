import createCtx from 'utils/context';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';
import epubToTxt from 'Libraries/epubToTxt';

interface ILibraryProviderProps {
    children: React.ReactNode;
}

export interface IBookInfo {
    id: string;
    title: string;
    creator?: string;
    cover: string | boolean;

    totalWords: number;
}

interface ILibraryContext {
    library: IBookInfo[];

    loadBooks: (files: Blob[]) => void;
    deleteBook: (id: string) => void;

    getBook: (id: string) => Promise<{
        info: IBookInfo;
        text: string;
    }>;
}

const [useLibraryContext, Provider] = createCtx<ILibraryContext>();

const LibraryProvider = ({ children }: ILibraryProviderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [library, setLibrary] = useState<IBookInfo[]>([]);

    useEffect(() => {
        (async () => {
            const data = await localforage.getItem<IBookInfo[]>('library');
            setLibrary((data as any) || []);

            for (let item of (data || []) as any) {
                const coverBlob = await localforage.getItem(`${item.id}_cover`);
                if (coverBlob) {
                    (item as any).cover = URL.createObjectURL(coverBlob);
                }
            }
            setIsLoading(false);
        })();
    }, []);

    // const bookExists = useCallback(
    //     (id: string) => {
    //         if (!library) {
    //             return false;
    //         }
    //         return !!library.find((item) => item.id === id);
    //     },
    //     [library]
    // );

    //
    const loadBooks = useCallback(
        async (files: Blob[]) => {
            const parsedBooks = await Promise.all(
                Array.from(files).map((file) => epubToTxt(file))
            );

            const loadedBooks = parsedBooks
            .filter(book => {
                return !library.find((item) => item.id === book.metadata.identifier);
            })
            .map((book) => {

                const bookInfo = {
                    id: book.metadata.identifier,
                    title: book.metadata.title || '',
                    creator: book.metadata.creator || '',
                    cover: !!book.cover,

                    totalWords: book.words.length,
                };

                return {
                    id: bookInfo.id,
                    info: bookInfo,
                    text: book.text,
                    cover: book.cover,
                    coverUrl: book.cover
                        ? URL.createObjectURL(book.cover)
                        : false,
                };
            });

            await Promise.all(
                loadedBooks.map(({ id, text }) =>
                    localforage.setItem(id, text)
                )
            );

            console.log(loadedBooks);

            const newLibrary = [
                ...library,
                ...loadedBooks.map(({ info }) => info),
            ];
            await localforage.setItem('library', newLibrary);

            await Promise.all(
                loadedBooks
                    .filter(({ cover }) => !!cover)
                    .map(({ id, cover }) =>
                        localforage.setItem(`${id}_cover`, cover)
                    )
            );

            setLibrary([
                ...library,
                ...loadedBooks.map(({ info, coverUrl }) => ({
                    ...info,
                    cover: coverUrl,
                })),
            ]);
        },
        [library]
    );

    const deleteBook = useCallback((id: string) => {}, []);

    const getBook = useCallback(
        async (id: string) => {
            const text = (await localforage.getItem<string>(id)) || '';
            const info = library!.find((item) => item.id === id)!;
            return {
                info,
                text,
            };
        },
        [library]
    );

    if (isLoading) {
        return null;
    }

    return (
        <Provider
            value={{
                library,

                loadBooks,
                deleteBook,

                getBook,
            }}
        >
            {children}
        </Provider>
    );
};

export { useLibraryContext };

export default LibraryProvider;