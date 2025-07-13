
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { XIcon } from '../icons/XIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { MastercardIcon } from '../icons/MastercardIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { DoorOpenIcon } from '../icons/DoorOpenIcon';


interface ProfileModalProps {
    profile: UserProfile;
    onSave: (updatedProfile: UserProfile) => void;
    onClose: () => void;
    onOpenAddCard: () => void;
    onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onSave, onClose, onOpenAddCard, onLogout }) => {
    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const [email, setEmail] = useState(profile.email);

    const handleSave = () => {
        onSave({ ...profile, name, phone, email });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transform transition-all max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Профиль</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center space-x-4">
                        <img src={profile.photoUrl} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-700" />
                        <div className="flex-1">
                             <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full text-xl font-bold bg-transparent focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50 rounded-lg p-2 -ml-2" />
                             <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full text-sm text-gray-500 dark:text-gray-400 bg-transparent focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50 rounded-lg p-2 -ml-2" />
                        </div>
                         <button onClick={onLogout} title="Выйти" className="p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition-colors">
                            <DoorOpenIcon className="w-6 h-6" />
                        </button>
                    </div>
                   
                    <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <WalletIcon className="w-6 h-6 text-green-600 dark:text-green-300"/>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Кошелек</p>
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{profile.walletBalance} ₽</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-full hover:bg-green-700 transition">Пополнить</button>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2 pt-2">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Способы оплаты</h3>
                        {profile.paymentMethods.map(card => (
                            <div key={card.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <MastercardIcon className="w-8 h-8 mr-4" />
                                <div className="flex-1">
                                    <p className="font-semibold">Mastercard <span className="text-gray-500 dark:text-gray-400">•••• {card.last4}</span></p>
                                </div>
                                <button className="text-gray-400 hover:text-red-500">
                                    <XIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                         <button onClick={onOpenAddCard} className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400 font-semibold">
                            <PlusIcon className="w-5 h-5"/>
                            <span>Добавить карту</span>
                        </button>
                    </div>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex space-x-4 mt-auto">
                    <button onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors">
                        Закрыть
                    </button>
                    <button onClick={handleSave} className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;