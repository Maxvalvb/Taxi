
import React, { useState } from 'react';
import { Driver } from '../../types';
import { XIcon } from '../icons/XIcon';
import { StarIcon } from '../icons/StarIcon';

interface RatingModalProps {
    driver: Driver;
    onClose: () => void;
}

const tipAmounts = [50, 100, 200];

const RatingModal: React.FC<RatingModalProps> = ({ driver, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [tip, setTip] = useState<number | null>(null);

    const handleSubmit = () => {
        console.log({ rating, tip, comment });
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transform transition-all p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Оцените поездку</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="text-center space-y-2">
                    <img src={driver.photoUrl} alt={driver.name} className="w-20 h-20 rounded-full mx-auto border-4 border-white dark:border-gray-700"/>
                    <h3 className="text-lg font-semibold">{driver.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{driver.carModel}</p>
                </div>

                <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <StarIcon className="w-8 h-8 transition-colors" filled={(hoverRating || rating) >= star} />
                        </button>
                    ))}
                </div>
                
                <div>
                    <h4 className="font-semibold mb-2">Оставить чаевые</h4>
                    <div className="flex justify-center space-x-3">
                        {tipAmounts.map(amount => (
                             <button 
                                key={amount}
                                onClick={() => setTip(amount)}
                                className={`px-6 py-2 rounded-full border-2 font-semibold transition-colors ${tip === amount ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-blue-400'}`}
                             >
                                {amount} ₽
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Оставьте комментарий (необязательно)"
                        rows={3}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
