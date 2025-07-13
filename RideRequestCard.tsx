import React, { useState, useEffect } from 'react';
import { LocationPinIcon } from '../icons/LocationPinIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';

interface RideRequestCardProps {
    pickup: string;
    destination: string;
    fare: string;
    onAccept: () => void;
    onDecline: () => void;
}

const RIDE_ACCEPTANCE_TIMEOUT = 20; // seconds

const RideRequestCard: React.FC<RideRequestCardProps> = ({ pickup, destination, fare, onAccept, onDecline }) => {
    const [timeLeft, setTimeLeft] = useState(RIDE_ACCEPTANCE_TIMEOUT);

    useEffect(() => {
        if (timeLeft <= 0) {
            onDecline();
            return;
        }
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, onDecline]);

    const progress = (timeLeft / RIDE_ACCEPTANCE_TIMEOUT) * 100;

    return (
        <div className="w-full bg-blue-600 text-white rounded-2xl shadow-2xl p-5 space-y-4 animate-toast-in relative overflow-hidden">
            <div 
                className="absolute top-0 left-0 bottom-0 bg-blue-700/50"
                style={{ width: `${progress}%`, transition: 'width 1s linear' }}
            ></div>

            <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold text-center">Новый заказ!</h2>
                
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <LocationPinIcon className="w-6 h-6 text-green-300 mt-1" />
                        <div>
                            <p className="text-sm opacity-80">Откуда</p>
                            <p className="font-semibold">{pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <LocationPinIcon className="w-6 h-6 text-red-300 mt-1" />
                        <div>
                            <p className="text-sm opacity-80">Куда</p>
                            <p className="font-semibold">{destination}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <DollarSignIcon className="w-6 h-6 text-yellow-300 mt-1" />
                        <div>
                            <p className="text-sm opacity-80">Стоимость</p>
                            <p className="font-bold text-xl">{fare} ₽</p>
                        </div>
                    </div>
                </div>

                <div className="text-center font-bold text-4xl">
                    {timeLeft}
                </div>

                <div className="flex space-x-4 pt-2">
                    <button onClick={onDecline} className="flex-1 py-3 px-4 rounded-lg bg-white/20 hover:bg-white/40 font-bold transition-colors">
                        Отклонить
                    </button>
                    <button onClick={onAccept} className="flex-1 py-3 px-4 rounded-lg bg-green-400 hover:bg-green-500 text-green-900 font-bold transition-colors">
                        Принять
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RideRequestCard;
