
import React, { useState } from 'react';
import { XIcon } from '../icons/XIcon';

interface ScheduleModalProps {
    onClose: () => void;
    onSchedule: (dateTime: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, onSchedule }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');

    const handleSchedule = () => {
        onSchedule(`${date}T${time}`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transform transition-all p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Запланировать поездку</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">Выберите дату и время подачи автомобиля.</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Дата</label>
                        <input 
                            type="date" 
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Время</label>
                        <input 
                            type="time" 
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors">
                        Отмена
                    </button>
                    <button 
                        onClick={handleSchedule}
                        className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                    >
                        Запланировать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
