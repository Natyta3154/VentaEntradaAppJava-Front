import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'success' | 'warning' | 'danger' | 'info' | 'default', className?: string }> = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        default: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
