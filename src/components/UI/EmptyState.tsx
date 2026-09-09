import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-inner">
                {icon || <AlertCircle className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">{title}</h3>
            <p className="text-gray-400 mb-6 max-w-md">{description}</p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
};
