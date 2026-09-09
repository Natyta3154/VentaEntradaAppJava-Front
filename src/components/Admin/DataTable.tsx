import React from 'react';
import { Edit, Trash2, Undo2, Ticket } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onRefund?: (item: any) => void;
    onManageTickets?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onEdit, onDelete, onRefund, onManageTickets }) => {
    const hasActions = onEdit || onDelete || onRefund || onManageTickets;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="bg-zinc-900/80 text-gray-400 font-semibold uppercase text-xs tracking-wider p-4 text-left border-b-2 border-rose-500/20">
                                {col.label}
                            </th>
                        ))}
                        {hasActions && <th className="bg-zinc-900/80 text-gray-400 font-semibold uppercase text-xs tracking-wider p-4 text-left border-b-2 border-rose-500/20">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={row.id || i} className="group">
                            {columns.map((col, colIndex) => (
                                <td key={`${row.id}-${col.key}`} className={`p-4 bg-zinc-900/40 text-gray-200 align-middle border-t border-b border-white/5 transition-colors group-hover:bg-white/5
                                    ${colIndex === 0 ? 'border-l rounded-l-lg' : ''}
                                    ${colIndex === columns.length - 1 && !hasActions ? 'border-r rounded-r-lg' : ''}
                                `}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {hasActions && (
                                <td className="flex gap-3 items-center justify-start p-4 bg-zinc-900/40 text-gray-200 align-middle border-t border-b border-r border-white/5 transition-colors group-hover:bg-white/5 rounded-r-lg">
                                    {onEdit && (
                                        <button 
                                            title="Editar"
                                            className="inline-flex items-center justify-center w-9 h-9 border border-rose-500/20 rounded-lg bg-zinc-900/50 text-gray-400 cursor-pointer transition-all duration-200 hover:bg-violet-600/10 hover:border-violet-500 hover:text-violet-500 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.2)] active:translate-y-0 active:scale-95" 
                                            onClick={() => onEdit(row)}
                                        >
                                            <Edit size={16} />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button 
                                            title="Eliminar"
                                            className="inline-flex items-center justify-center w-9 h-9 border border-rose-500/20 rounded-lg bg-zinc-900/50 text-gray-400 cursor-pointer transition-all duration-200 hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-500 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(244,63,94,0.2)] active:translate-y-0 active:scale-95" 
                                            onClick={() => onDelete(row)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    {onRefund && row.estado === 'COMPLETADA' && (
                                        <button 
                                            title="Reembolsar"
                                            className="inline-flex items-center justify-center w-9 h-9 border border-emerald-500/20 rounded-lg bg-zinc-900/50 text-gray-400 cursor-pointer transition-all duration-200 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-500 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] active:translate-y-0 active:scale-95" 
                                            onClick={() => onRefund(row)}
                                        >
                                            <Undo2 size={16} />
                                        </button>
                                    )}
                                    {onManageTickets && (
                                        <button 
                                            title="Tickets"
                                            className="inline-flex items-center justify-center w-9 h-9 border border-indigo-500/20 rounded-lg bg-zinc-900/50 text-gray-400 cursor-pointer transition-all duration-200 hover:bg-indigo-500/10 hover:border-indigo-500 hover:text-indigo-500 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] active:translate-y-0 active:scale-95" 
                                            onClick={() => onManageTickets(row)}
                                        >
                                            <Ticket size={16} />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center p-8 text-gray-400 bg-zinc-900/40 border border-white/5 rounded-lg">
                                No se encontraron registros.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
