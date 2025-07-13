import React from 'react';
import { UserProfile } from '../../types';
import { PhoneIcon } from '../icons/PhoneIcon';
import { ChatIcon } from '../icons/ChatIcon';

interface ClientInfoCardProps {
  client: UserProfile;
  onChat: () => void;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ client, onChat }) => (
    <div className="w-full bg-gray-50 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center space-x-4">
        <img src={client.photoUrl} alt={client.name} className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 shadow-md" />
        <div className="text-left flex-1">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{client.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Клиент</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={onChat} className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"><ChatIcon className="w-6 h-6 text-blue-600 dark:text-blue-400"/></button>
            <button className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"><PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-400"/></button>
        </div>
        </div>
    </div>
);

export default ClientInfoCard;