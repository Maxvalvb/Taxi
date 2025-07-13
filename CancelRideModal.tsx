
import React, { useState } from 'react';
import { XIcon } from '../icons/XIcon';

interface CancelRideModalProps {
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const cancelReasons = [
    "Водитель едет слишком долго",
    "Передумал(а) ехать",
    "Неправильно указан адрес",
    "Заказал(а) случайно",
    "Нашел(а) другую машину",
    "Другое",
];

const CancelRideModal: React.FC<CancelRideModalProps> = ({ onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transform transition-all p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Отмена поездки</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">Пожалуйста, укажите причину отмены. Это поможет нам стать лучше.</p>

                <div className="space-y-2">
                    {cancelReasons.map(reason => (
                        <button 
                            key={reason}
                            onClick={() => setSelectedReason(reason)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedReason === reason ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500' : 'bg-gray-50 dark:bg-gray-700/50 border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                        >
                            {reason}
                        </button>
                    ))}
                </div>

                <div className="flex space-x-4 pt-4">
                    <button onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors">
                        Не отменять
                    </button>
                    <button 
                        onClick={() => selectedReason && onConfirm(selectedReason)}
                        disabled={!selectedReason}
                        className="flex-1 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
                    >
                        Подтвердить отмену
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelRideModal;
