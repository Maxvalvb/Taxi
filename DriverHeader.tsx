import React from 'react';
import { UserIcon } from '../icons/UserIcon';
import DarkModeToggle from '../DarkModeToggle';
import { WalletIcon } from '../icons/WalletIcon';
import { HistoryIcon } from '../icons/HistoryIcon';

interface DriverHeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    earningsToday: number;
    onOpenProfile: () => void;
    onOpenRideHistory: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({ isDarkMode, toggleDarkMode, earningsToday, onOpenProfile, onOpenRideHistory }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 md:p-6 z-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tighter">
            Tax<span className="text-blue-600 dark:text-blue-400">i</span> <span className="text-base font-medium text-gray-500 dark:text-gray-400">Driver</span>
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className="flex items-center space-x-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md">
                <WalletIcon className="h-6 w-6 text-green-500"/>
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{earningsToday} ₽</span>
             </div>
             <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
             <button onClick={onOpenRideHistory} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <HistoryIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
             </button>
             <button onClick={onOpenProfile} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                 <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DriverHeader;
