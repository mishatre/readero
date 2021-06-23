
import { BrowserRouter as Router, } from 'react-router-dom';
import StorageProvider from './Storage';

interface IProvidersProps { 
    children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
    return (
        <Router>
            <StorageProvider>
                {children}
            </StorageProvider>
        </Router>
    )
}

export default Providers;