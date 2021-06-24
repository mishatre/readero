import { BrowserRouter as Router } from 'react-router-dom';
import SettingsProvider from './Settings';
import StorageProvider from './Library';
import ReadingStatsProvider from './ReadingStats';

interface IProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
    return (
        <Router>
            <SettingsProvider>
                <ReadingStatsProvider>
                    <StorageProvider>{children}</StorageProvider>
                </ReadingStatsProvider>
            </SettingsProvider>
        </Router>
    );
};

export default Providers;
