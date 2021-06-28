import createCtx from 'utils/context';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';
import epubToTxt from 'libraries/epubToTxt';

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
    deleteBooks: (id: string[]) => void;

    getBook: (
        id: string
    ) => Promise<{
        info: IBookInfo;
        words: string[];
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

    const loadBooks = useCallback(
        async (files: Blob[]) => {
            const parsedBooks = await Promise.all(
                Array.from(files).map((file) => epubToTxt(file))
            );

            const loadedBooks = parsedBooks
                .filter((book) => {
                    return !library.find(
                        (item) => item.id === book.metadata.identifier
                    );
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
                        words: book.words,
                        cover: book.cover,
                        coverUrl: book.cover
                            ? URL.createObjectURL(book.cover)
                            : false,
                    };
                });

            await Promise.all(
                loadedBooks.map(({ id, words }) =>
                    localforage.setItem(id, words)
                )
            );

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

    const deleteBooks = useCallback(
        async (ids: string[]) => {
            const newLibrary = [];

            const promiseArray = [];
            for (const bookInfo of library) {
                if (ids.includes(bookInfo.id)) {
                    if (bookInfo.cover) {
                        promiseArray.push(
                            localforage.removeItem(`${bookInfo.id}_cover`)
                        );
                    }
                    promiseArray.push(localforage.removeItem(bookInfo.id));

                    localStorage.removeItem(bookInfo.id);
                } else {
                    newLibrary.push(bookInfo);
                }
            }

            promiseArray.push(localforage.setItem('library', newLibrary));

            await Promise.all(promiseArray as Promise<any>[]);
            setLibrary((prev) => prev.filter((v) => !ids.includes(v.id)));
        },
        [library]
    );

    const getBook = useCallback(
        async (id: string) => {
            const words = (await localforage.getItem<string[]>(id)) || [];
            const info = library!.find((item) => item.id === id)!;
            return {
                info,
                words,
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
                deleteBooks,

                getBook,
            }}
        >
            {children}
        </Provider>
    );
};

export { useLibraryContext };

export default LibraryProvider;
