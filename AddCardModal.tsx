import React, { useState } from 'react';
import { XIcon } from '../icons/XIcon';
import { PaymentCard } from '../../types';
import { CreditCardIcon } from '../icons/CreditCardIcon';

interface AddCardModalProps {
    onClose: () => void;
    onAddCard: (card: PaymentCard) => void;
}

const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

const formatExpiryDate = (value: string) => {
    return value.replace(/[^0-9]/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
}

const AddCardModal: React.FC<AddCardModalProps> = ({ onClose, onAddCard }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleAddCard = () => {
        if (cardNumber.length >= 19 && expiry.length === 5 && cvc.length === 3) {
            onAddCard({
                id: `card_${Date.now()}`,
                last4: cardNumber.slice(-4),
                brand: 'mastercard', // Simplified for demo
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transform transition-all p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Добавить карту</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">Введите данные вашей банковской карты.</p>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Номер карты</label>
                        <CreditCardIcon className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                        <input 
                            type="text"
                            inputMode="numeric"
                            value={formatCardNumber(cardNumber)}
                            onChange={e => setCardNumber(e.target.value)}
                            maxLength={19}
                            placeholder="0000 0000 0000 0000"
                            className="w-full mt-1 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Срок действия</label>
                             <input 
                                type="text"
                                inputMode="numeric"
                                value={formatExpiryDate(expiry)}
                                onChange={e => setExpiry(e.target.value)}
                                placeholder="ММ/ГГ"
                                className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">CVC/CVV</label>
                            <input 
                                type="text"
                                inputMode="numeric"
                                value={cvc}
                                onChange={e => setCvc(e.target.value)}
                                maxLength={3}
                                placeholder="123"
                                className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors">
                        Отмена
                    </button>
                    <button 
                        onClick={handleAddCard}
                        className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;
