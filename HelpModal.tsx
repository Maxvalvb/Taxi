
import React from 'react';
import { XIcon } from '../icons/XIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { ChatIcon } from '../icons/ChatIcon';

interface HelpModalProps {
    onClose: () => void;
}

const faqs = [
    { q: "Как изменить способ оплаты?", a: "Вы можете изменить способ оплаты на главном экране перед подтверждением заказа." },
    { q: "Можно ли добавить остановку?", a: "Да, нажмите на иконку '+' рядом с полем назначения, чтобы добавить промежуточную остановку." },
    { q: "Что делать, если я забыл вещи?", a: "Свяжитесь со службой поддержки через чат или по телефону, и мы постараемся помочь." },
    { q: "Как отменить поездку?", a: "Нажмите кнопку 'Отменить' на экране поиска или подтверждения водителя." },
];

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg h-full max-h-[80vh] flex flex-col transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Центр помощи</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Часто задаваемые вопросы</h3>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index}>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{faq.q}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-3">Связаться с поддержкой</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-semibold text-blue-700 dark:text-blue-300">
                                <ChatIcon className="w-5 h-5" />
                                <span>Начать чат</span>
                            </button>
                             <button className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 transition-colors font-semibold text-green-700 dark:text-green-300">
                                <PhoneIcon className="w-5 h-5" />
                                <span>Позвонить</span>
                            </button>
                        </div>
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

export default HelpModal;
