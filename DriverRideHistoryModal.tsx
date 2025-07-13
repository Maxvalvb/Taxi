import React from 'react';
import { RideHistoryEntry } from '../../types';
import { XIcon } from '../icons/XIcon';
import { LocationPinIcon } from '../icons/LocationPinIcon';
import { HistoryIcon } from '../icons/HistoryIcon';

interface DriverRideHistoryModalProps {
    rideHistory: RideHistoryEntry[];
    onClose: () => void;
}

const DriverRideHistoryModal: React.FC<DriverRideHistoryModalProps> = ({ rideHistory, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg h-full max-h-[80vh] flex flex-col transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                     <div className="flex items-center space-x-3">
                        <HistoryIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold">Ваши поездки</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                    {rideHistory.length > 0 ? (
                        <ul className="space-y-4">
                            {rideHistory.map(ride => (
                                <li key={ride.id} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{ride.date}</p>
                                            <p className="font-bold text-lg text-green-600 dark:text-green-400">{ride.fare} ₽</p>
                                        </div>
                                         <p className="text-sm font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">{ride.driver.name}</p>
                                    </div>
                                    <div className="mt-3 space-y-2 text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
                                        <div className="flex items-center space-x-2">
                                            <LocationPinIcon className="w-4 h-4 text-green-500"/>
                                            <span className="text-gray-600 dark:text-gray-300">{ride.pickup}</span>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <LocationPinIcon className="w-4 h-4 text-red-500"/>
                                            <span className="text-gray-600 dark:text-gray-300">{ride.destination}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-10">
                            <HistoryIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600"/>
                            <p className="mt-4 text-gray-500 dark:text-gray-400">История поездок пуста.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Завершите свою первую поездку, чтобы она появилась здесь.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverRideHistoryModal;
