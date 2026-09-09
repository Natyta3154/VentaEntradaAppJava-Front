import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 ${className}`}>
        {children}
    </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-700 bg-gray-900/50 ${className}`}>
        {children}
    </div>
);

export const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);
