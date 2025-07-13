
import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ChatMessage } from '../types';

interface ChatModalProps {
  partner: { name: string; photoUrl: string };
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ partner, messages, onSendMessage, onClose }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-toast-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg h-full max-h-[80vh] sm:max-h-[70vh] flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img src={partner.photoUrl} alt={partner.name} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">{partner.name}</h3>
              <p className="text-sm text-green-500 dark:text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
              <PhoneIcon className="w-6 h-6" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender !== 'user' && <img src={partner.photoUrl} className="w-6 h-6 rounded-full self-start" />}
              <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
                 <div className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button onClick={handleSend} className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-800" disabled={!text.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;