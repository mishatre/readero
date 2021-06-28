import { HashRouter as Router } from 'react-router-dom';
import SettingsProvider from './Settings';
import StorageProvider from './Library';
import ReadingStatsProvider from './ReadingStats';

import { useState } from 'react';
import { useEffect } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import useRootDimension from 'hooks/useRootDimensions';

interface IProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        Promise.all([
            (document as any).fonts.load('16px Liberation Mono'),
            (document as any).fonts.load('32px SFMono'),
        ]).then(() => {
            setLoaded(true);
        });
    }, []);

    const dimensions = useRootDimension();
    if (!dimensions) {
        return null;
    }

    return (
        <Router>
            <SettingsProvider dimensions={dimensions}>
                <ReadingStatsProvider>
                    <StorageProvider>
                        {!loaded && <LoadingScreen />}
                        {loaded && children}
                    </StorageProvider>
                </ReadingStatsProvider>
            </SettingsProvider>
        </Router>
    );
};

export default Providers;
