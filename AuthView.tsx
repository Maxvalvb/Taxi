import React, { useState } from 'react';
import { UserMode } from '../types';
import { UserIcon } from '../components/icons/UserIcon';
import { CarIcon } from '../components/icons/CarIcon';
import { ShieldIcon } from '../components/icons/ShieldIcon';
import { useAppContext } from '../contexts/AppContext';
import Spinner from '../components/Spinner';

const AuthButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isLoading: boolean;
}> = ({ label, icon, onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="flex flex-col items-center justify-center space-y-4 p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
  >
    <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full relative w-24 h-24 flex items-center justify-center">
        {isLoading ? <Spinner /> : icon}
    </div>
    <span className="text-xl font-bold text-gray-800 dark:text-white">{label}</span>
  </button>
);

const AuthView: React.FC = () => {
    const { login } = useAppContext();
    const [loadingMode, setLoadingMode] = useState<UserMode | null>(null);

    const handleLogin = async (mode: UserMode) => {
        setLoadingMode(mode);
        try {
            await login(mode);
        } catch (error) {
            console.error("Login failed", error);
            // Optionally show a toast message here
            setLoadingMode(null);
        }
        // setLoadingMode(null) is not needed on success because the component will unmount
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900 p-4">
             <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white tracking-tighter">
                    Tax<span className="text-blue-600 dark:text-blue-400">i</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Добро пожаловать! Выберите свою роль для входа.</p>
             </div>
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <AuthButton
                    label="Я - Клиент"
                    icon={<UserIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
                    onClick={() => handleLogin(UserMode.CLIENT)}
                    isLoading={loadingMode === UserMode.CLIENT}
                />
                <AuthButton
                    label="Я - Водитель"
                    icon={<CarIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
                    onClick={() => handleLogin(UserMode.DRIVER)}
                    isLoading={loadingMode === UserMode.DRIVER}
                />
                <AuthButton
                    label="Я - Администратор"
                    icon={<ShieldIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
                    onClick={() => handleLogin(UserMode.ADMIN)}
                    isLoading={loadingMode === UserMode.ADMIN}
                />
             </div>
        </div>
    );
};

export default AuthView;