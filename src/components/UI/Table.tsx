import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => (
    <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-sm text-left text-gray-300">
            {children}
        </table>
    </div>
);

export const Thead: React.FC<TableProps> = ({ children, className = '' }) => (
    <thead className={`text-xs text-gray-400 uppercase bg-gray-900/50 ${className}`}>
        {children}
    </thead>
);

export const Tbody: React.FC<TableProps> = ({ children, className = '' }) => (
    <tbody className={`divide-y divide-gray-700 ${className}`}>
        {children}
    </tbody>
);

export const Tr: React.FC<TableProps> = ({ children, className = '' }) => (
    <tr className={`hover:bg-gray-800/50 transition-colors ${className}`}>
        {children}
    </tr>
);

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export const Th: React.FC<ThProps> = ({ children, className = '', ...props }) => (
    <th scope="col" className={`px-6 py-3 font-medium whitespace-nowrap ${className}`} {...props}>
        {children}
    </th>
);

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export const Td: React.FC<TdProps> = ({ children, className = '', ...props }) => (
    <td className={`px-6 py-4 ${className}`} {...props}>
        {children}
    </td>
);
