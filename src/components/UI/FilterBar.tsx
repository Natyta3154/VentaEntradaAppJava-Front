import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    children?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onSearch, placeholder = 'Buscar...', children }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder={placeholder}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            {children && (
                <div className="flex items-center gap-4">
                    {children}
                </div>
            )}
        </div>
    );
};
