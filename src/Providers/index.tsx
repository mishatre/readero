import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import SettingsProvider from './Settings';
import StorageProvider from './Library';
import ReadingStatsProvider from './ReadingStats';

import { store } from 'store';

interface IProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
    return (
        <Provider store={store}>
            <Router basename="readero">
                 <SettingsProvider>
                     <ReadingStatsProvider>
                         <StorageProvider>{children}</StorageProvider>
                     </ReadingStatsProvider>
                 </SettingsProvider>
             </Router>
        </Provider>
    );
};

export default Providers;
