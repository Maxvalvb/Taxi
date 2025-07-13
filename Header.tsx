
import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { UserIcon } from './icons/UserIcon';
import DarkModeToggle from './DarkModeToggle';
import { WalletIcon } from './icons/WalletIcon';
import { HelpIcon } from './icons/HelpIcon';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    walletBalance: number;
    onOpenProfile: () => void;
    onOpenMenu: () => void;
    onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, walletBalance, onOpenProfile, onOpenMenu, onOpenHelp }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 md:p-6 z-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tighter">
            Tax<span className="text-blue-600 dark:text-blue-400">i</span>
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className="hidden sm:flex items-center space-x-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md">
                <WalletIcon className="h-6 w-6 text-green-500"/>
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{walletBalance} ₽</span>
             </div>
             <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
             <button onClick={onOpenProfile} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                 <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
             </button>
             <button onClick={onOpenHelp} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <HelpIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
             </button>
             <button onClick={onOpenMenu} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MenuIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
