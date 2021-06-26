import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import SettingsProvider from './Settings';
import StorageProvider from './Library';
import ReadingStatsProvider from './ReadingStats';

import { store } from 'store';
import { useState } from 'react';
import { useEffect } from 'react';

interface IProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {

    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        Promise.all([
            (document as any).fonts.load('16px Liberation Mono'),
            (document as any).fonts.load('48px SFMono')
        ]).then(() => {
            setLoaded(true);
        })
    }, []);

    return (
        <Provider store={store}>
            <Router basename="readero">
                 <SettingsProvider>
                     <ReadingStatsProvider>
                         <StorageProvider>
                             {loaded && children}
                        </StorageProvider>
                     </ReadingStatsProvider>
                 </SettingsProvider>
             </Router>
        </Provider>
    );
};

export default Providers;
