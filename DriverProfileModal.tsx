
import React from 'react';
import { Driver } from '../../types';
import { XIcon } from '../icons/XIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { StarIcon } from '../icons/StarIcon';
import { DoorOpenIcon } from '../icons/DoorOpenIcon';

interface DriverProfileModalProps {
    driver: Driver;
    onClose: () => void;
    onLogout: () => void;
}

const DriverProfileModal: React.FC<DriverProfileModalProps> = ({ driver, onClose, onLogout }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Профиль водителя</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={driver.photoUrl} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-700" />
                        <div className="flex-1">
                             <h3 className="text-xl font-bold">{driver.name}</h3>
                             <p className="text-gray-500 dark:text-gray-400">{driver.carModel} - {driver.licensePlate}</p>
                        </div>
                        <button onClick={onLogout} title="Выйти" className="p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition-colors">
                            <DoorOpenIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Рейтинг</p>
                            <p className="font-bold text-2xl flex items-center justify-center space-x-1">{driver.rating.toFixed(1)} <StarIcon filled className="w-5 h-5" /></p>
                        </div>
                         <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Поездок сегодня</p>
                            <p className="font-bold text-2xl">{driver.pastTrips.length}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <WalletIcon className="w-6 h-6 text-green-600 dark:text-green-300"/>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Заработано сегодня</p>
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{driver.earningsToday} ₽</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">Статистика</button>
                    </div>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="w-full py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverProfileModal;