import React from 'react';
import { UserMode } from '../types';
import { UserIcon } from './icons/UserIcon';
import { CarIcon } from './icons/CarIcon';
import { ShieldIcon } from './icons/ShieldIcon';

interface ModeSwitcherProps {
  activeMode: UserMode;
  setMode: (mode: UserMode) => void;
}

const ModeButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`}
  >
    {icon}
    <span className="text-xs sm:text-sm font-semibold">{label}</span>
  </button>
);

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ activeMode, setMode }) => {
  return (
    <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 z-20 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        <ModeButton
          label="Клиент"
          icon={<UserIcon className="w-5 h-5" />}
          isActive={activeMode === UserMode.CLIENT}
          onClick={() => setMode(UserMode.CLIENT)}
        />
        <ModeButton
          label="Водитель"
          icon={<CarIcon className="w-5 h-5" />}
          isActive={activeMode === UserMode.DRIVER}
          onClick={() => setMode(UserMode.DRIVER)}
        />
        <ModeButton
          label="Админ"
          icon={<ShieldIcon className="w-5 h-5" />}
          isActive={activeMode === UserMode.ADMIN}
          onClick={() => setMode(UserMode.ADMIN)}
        />
      </div>
    </div>
  );
};

export default ModeSwitcher;