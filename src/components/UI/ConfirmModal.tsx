import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-300">{message}</p>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-gray-700 bg-gray-900/50 rounded-b-xl">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:ring-4 focus:ring-gray-600 focus:outline-none"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:ring-4 focus:outline-none ${
                            isDestructive 
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-900' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-900'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
