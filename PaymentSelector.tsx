
import React from 'react';
import { PaymentMethod } from '../types';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { CashIcon } from './icons/CashIcon';

interface PaymentSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentOption: React.FC<{
    method: PaymentMethod;
    icon: React.ReactNode;
    label: string;
    isSelected: boolean;
    onClick: (method: PaymentMethod) => void;
}> = ({ method, icon, label, isSelected, onClick }) => (
    <button
        onClick={() => onClick(method)}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
            isSelected 
                ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
        }`}
    >
        {icon}
        <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>{label}</span>
    </button>
)

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-3">
      <PaymentOption
        method={PaymentMethod.CARD}
        icon={<CreditCardIcon className="w-5 h-5" />}
        label="Карта"
        isSelected={selected === PaymentMethod.CARD}
        onClick={onSelect}
      />
      <PaymentOption
        method={PaymentMethod.CASH}
        icon={<CashIcon className="w-5 h-5" />}
        label="Наличные"
        isSelected={selected === PaymentMethod.CASH}
        onClick={onSelect}
      />
    </div>
  );
};

export default PaymentSelector;
