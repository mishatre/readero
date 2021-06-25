import createCtx from '../../utils/context';
import { useCallback, useEffect, useState } from 'react';

interface IReadingStatsProviderProps {
    children: React.ReactNode;
}

interface IReadingStatsContext {
    getBookStats: (id: string) => IBookStat;
    setBookCurrentWordIndex: (id: string, newWordIndex: number) => void;
    updateBookCurrentWordIndex: (id: string, incValue: number) => number;
    setBookSentenceWordIndex: (id: string, newSentenceIndex: number) => void;
    updateBookSentenceWordIndex: (id: string, incValue: number) => number;
}

export interface IBookStat {
    currentWordIndex: number;
    currentSentenceIndex: number;
}

const [useReadingStatsContext, Provider] = createCtx<IReadingStatsContext>();

const ReadingStatsProvider = ({ children }: IReadingStatsProviderProps) => {
    const getBookStats = useCallback((id: string) => {
        const savedBookStat = localStorage.getItem(id);
        if (!savedBookStat) {
            const newBookStat = {
                currentWordIndex: 0,
                currentSentenceIndex: 0,
            };
            localStorage.setItem(id, JSON.stringify(newBookStat));
            return newBookStat;
        }
        return JSON.parse(savedBookStat);
    }, []);

    const setBookCurrentWordIndex = useCallback(
        (id: string, newWordIndex: number) => {
            const savedBookStat = localStorage.getItem(id);
            if (!savedBookStat) {
                return;
            }
            localStorage.setItem(
                id,
                JSON.stringify({
                    ...JSON.parse(savedBookStat),
                    currentWordIndex: newWordIndex,
                })
            );
        },
        []
    );

    const updateBookCurrentWordIndex = useCallback(
        (id: string, incValue: number) => {
            const savedBookStat = localStorage.getItem(id);
            if (!savedBookStat) {
                return 0;
            }
            const currentBookStat = JSON.parse(savedBookStat);
            const currentWordIndex =
                currentBookStat.currentWordIndex + incValue;
            localStorage.setItem(
                id,
                JSON.stringify({
                    ...currentBookStat,
                    currentWordIndex,
                })
            );
            return currentWordIndex;
        },
        []
    );

    const setBookSentenceWordIndex = useCallback(
        (id: string, newSentenceIndex: number) => {
            const savedBookStat = localStorage.getItem(id);
            if (!savedBookStat) {
                return;
            }
            localStorage.setItem(
                id,
                JSON.stringify({
                    ...JSON.parse(savedBookStat),
                    currentSentenceIndex: newSentenceIndex,
                })
            );
        },
        []
    );

    const updateBookSentenceWordIndex = useCallback(
        (id: string, incValue: number) => {
            const savedBookStat = localStorage.getItem(id);
            if (!savedBookStat) {
                return 0;
            }
            const currentBookStat = JSON.parse(savedBookStat);
            const currentSentenceIndex =
                currentBookStat.currentSentenceIndex + incValue;
            localStorage.setItem(
                id,
                JSON.stringify({
                    ...currentBookStat,
                    currentSentenceIndex,
                })
            );
            return currentSentenceIndex;
        },
        []
    );

    return (
        <Provider
            value={{
                getBookStats,
                setBookCurrentWordIndex,
                updateBookCurrentWordIndex,
                setBookSentenceWordIndex,
                updateBookSentenceWordIndex,
            }}
        >
            {children}
        </Provider>
    );
};

export { useReadingStatsContext };

export default ReadingStatsProvider;
