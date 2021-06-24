
import { BrowserRouter as Router, } from 'react-router-dom';
import SettingsProvider from './Settings';
import StorageProvider from './Library';

interface IProvidersProps { 
    children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
    return (
        <Router>
            <SettingsProvider>
                <StorageProvider>
                    {children}
                </StorageProvider>
            </SettingsProvider>
        </Router>
    )
}

export default Providers;