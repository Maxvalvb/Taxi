import React, { useState, useEffect, useCallback } from 'react';
import { XIcon } from './icons/XIcon';
import { ToastData } from '../types';

interface ToastProps extends ToastData {
    onClose: (id: number) => void;
}

const typeClasses = {
    success: {
        bg: 'bg-green-100 dark:bg-green-800/80',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-400 dark:border-green-600',
    },
    info: {
        bg: 'bg-blue-100 dark:bg-blue-800/80',
        text: 'text-blue-800 dark:text-blue-200',
        border: 'border-blue-400 dark:border-blue-600',
    },
    error: {
        bg: 'bg-red-100 dark:bg-red-800/80',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-400 dark:border-red-600',
    },
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 500);
    }, [id, onClose]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 4500);
        return () => clearTimeout(timer);
    }, [handleClose]);

    const classes = typeClasses[type];

    return (
        <div 
            className={`w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${classes.bg} ${classes.border} backdrop-blur-md ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
        >
            <div className={`flex-1 font-semibold ${classes.text}`}>
                {message}
            </div>
            <button onClick={handleClose} className={`p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${classes.text}`}>
                <XIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;