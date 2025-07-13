import React from 'react';
import { Driver, DriverState, UserProfile } from '../../types';
import { PowerIcon } from '../icons/PowerIcon';
import { CarIcon } from '../icons/CarIcon';
import ClientInfoCard from './ClientInfoCard';

interface DriverDashboardProps {
    driver: Driver;
    onToggleOnline: () => void;
    activeTrip: { pickup: string; destination: string; fare: number; } | null;
    clientProfile: UserProfile | null;
    onStartTrip: () => void;
    onEndTrip: () => void;
    onChat: () => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driver, onToggleOnline, activeTrip, clientProfile, onStartTrip, onEndTrip, onChat }) => {
    const isBusy = driver.state === DriverState.TO_PICKUP || driver.state === DriverState.TRIP_IN_PROGRESS || driver.state === DriverState.INCOMING_RIDE;

    const renderContent = () => {
        if (driver.state === DriverState.TO_PICKUP && activeTrip && clientProfile) {
            return (
                <div className="space-y-4">
                    <ClientInfoCard client={clientProfile} onChat={onChat} />
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Забрать клиента по адресу:</p>
                        <p className="font-semibold">{activeTrip.pickup}</p>
                    </div>
                    <button onClick={onStartTrip} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-all shadow-lg transform hover:scale-105">
                        Клиент в машине, начать поездку
                    </button>
                </div>
            );
        }
        if (driver.state === DriverState.TRIP_IN_PROGRESS && activeTrip && clientProfile) {
            return (
                <div className="space-y-4">
                     <ClientInfoCard client={clientProfile} onChat={onChat} />
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Пункт назначения:</p>
                        <p className="font-semibold">{activeTrip.destination}</p>
                    </div>
                    <button onClick={onEndTrip} className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-all shadow-lg transform hover:scale-105">
                        Завершить поездку
                    </button>
                </div>
            );
        }

        return (
            <div className="text-center space-y-4 py-8">
                <CarIcon className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-bold">
                    {driver.state === DriverState.ONLINE ? 'Ожидание заказов' : 'Вы не на линии'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 px-4">
                    {driver.state === DriverState.ONLINE ? 'Вам будут предложены новые поездки в вашем районе.' : 'Нажмите кнопку питания, чтобы выйти на линию.'}
                </p>
            </div>
        );
    }

    const StatusIndicator: React.FC<{ state: DriverState }> = ({ state }) => {
        const config = {
            [DriverState.OFFLINE]: { text: 'Оффлайн', color: 'bg-red-500' },
            [DriverState.ONLINE]: { text: 'Онлайн', color: 'bg-green-500' },
            [DriverState.INCOMING_RIDE]: { text: 'Новый заказ!', color: 'bg-blue-500 animate-pulse' },
            [DriverState.TO_PICKUP]: { text: 'Еду к клиенту', color: 'bg-yellow-500' },
            [DriverState.TRIP_IN_PROGRESS]: { text: 'В пути', color: 'bg-purple-500' },
        };
        const { text, color } = config[state] || config[DriverState.OFFLINE];
    
        return (
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="font-semibold">{text}</span>
            </div>
        );
    };

    return (
        <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 space-y-4">
             <div className="flex justify-between items-center">
                <StatusIndicator state={driver.state}/>
                <button onClick={onToggleOnline} disabled={isBusy} className={`p-3 rounded-full transition-colors ${driver.state === DriverState.OFFLINE ? 'bg-green-100 dark:bg-green-900/50 text-green-600' : 'bg-red-100 dark:bg-red-900/50 text-red-600'} disabled:opacity-50`}>
                    <PowerIcon className="w-6 h-6"/>
                </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {renderContent()}
            </div>
        </div>
    );
};

export default DriverDashboard;