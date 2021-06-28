import createCtx from '../../utils/context';
import { useCallback, useEffect, useState } from 'react';

interface IReadingStatsProviderProps {
    children: React.ReactNode;
}

interface IReadingStatsContext {
    getStats: (id: string) => IBookStat;
    setStats: <K extends keyof IBookStat>(
        id: string,
        key: K,
        value: IBookStat[K]
    ) => IBookStat;
}

export interface IBookStat {
    index: number;
}

const [useReadingStatsContext, Provider] = createCtx<IReadingStatsContext>();

const ReadingStatsProvider = ({ children }: IReadingStatsProviderProps) => {
    const getStats = useCallback((id: string) => {
        const stringStats = localStorage.getItem(id);
        if (stringStats) {
            return JSON.parse(stringStats);
        }
        return {
            index: 0,
        };
    }, []);
    const setStats = useCallback(
        <K extends keyof IBookStat>(
            id: string,
            key: K,
            value: IBookStat[K]
        ) => {
            let currentStats = {
                index: 0,
            };

            const stringStats = localStorage.getItem(id);
            if (stringStats) {
                currentStats = JSON.parse(stringStats);
            }
            currentStats[key] = value;
            localStorage.setItem(id, JSON.stringify(currentStats));

            return currentStats;
        },
        []
    );

    return (
        <Provider
            value={{
                getStats,
                setStats,
            }}
        >
            {children}
        </Provider>
    );
};

function useReadingStats(id: string) {
    const { getStats, setStats: set } = useReadingStatsContext();
    const [stats, setStatsState] = useState<IBookStat>(getStats(id));
    const setStats = useCallback(
        <K extends keyof IBookStat>(
            id: string,
            key: K,
            value: IBookStat[K]
        ) => {
            setStatsState(set(id, key, value));
        },
        [set]
    );
    useEffect(() => {
        setStatsState(getStats(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    return { stats, setStats };
}

export { useReadingStatsContext, useReadingStats };

export default ReadingStatsProvider;
