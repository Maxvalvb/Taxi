import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import ClientView from './views/ClientView';
import DriverView from './views/DriverView';
import AdminView from './views/AdminView';
import AuthView from './views/AuthView';
import { UserMode } from './types';
import LoadingOverlay from './components/LoadingOverlay';

const MainApp: React.FC = () => {
    const { auth, getDriverById, isInitializing } = useAppContext();

    if (isInitializing) {
        return <LoadingOverlay />;
    }

    if (!auth.isAuthenticated || !auth.userMode) {
        return <AuthView />;
    }

    const renderView = () => {
        switch (auth.userMode) {
            case UserMode.CLIENT:
                return <ClientView />;
            case UserMode.DRIVER:
                const driver = getDriverById('d1');
                if (!driver) return <LoadingOverlay />; // Show loading while driver data is fetched
                return <DriverView driverId="d1" />;
            case UserMode.ADMIN:
                return <AdminView />;
            default:
                return <AuthView />;
        }
    };
    
    return (
        <div className="h-screen w-screen overflow-hidden font-sans antialiased text-gray-800 dark:text-gray-200">
             <main className="flex-1 relative overflow-hidden h-full w-full">
                {renderView()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
};

export default App;