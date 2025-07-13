import React from 'react';
import Spinner from './Spinner';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tighter">
                Tax<span className="text-blue-600 dark:text-blue-400">i</span>
            </h1>
            <Spinner className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
    );
};

export default LoadingOverlay;
