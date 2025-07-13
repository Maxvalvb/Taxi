
import React from 'react';
import ClientView from './ClientView';
import DriverView from './DriverView';

const AdminView: React.FC = () => {
    // AdminView now acts as a shell.
    // ClientView and DriverView will consume the context directly.
    // This simplifies AdminView immensely and ensures data consistency.
    return (
        <div className="flex h-full w-full bg-gray-100 dark:bg-gray-900">
            <div className="w-1/2 h-full border-r-2 border-gray-200 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white font-bold px-4 py-1 rounded-full text-lg shadow-lg pointer-events-none">
                    Client
                </div>
                <ClientView />
            </div>

            <div className="w-1/2 h-full relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white font-bold px-4 py-1 rounded-full text-lg shadow-lg pointer-events-none">
                    Driver
                </div>
                {/* We simulate admin watching driver 'd1' */}
                <DriverView driverId="d1" />
            </div>
        </div>
    );
};

export default AdminView;