import React, { useEffect, useState } from 'react';
import { eventoService, Evento } from '../../../services/eventoService';
import { X, Plus, Ticket, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge, Table, Thead, Tbody, Tr, Th, Td } from '../../../components/UI';

interface TipoEntradaModalProps {
    evento: Evento;
    onClose: () => void;
}

const TipoEntradaModal: React.FC<TipoEntradaModalProps> = ({ evento, onClose }) => {
    const [tiposEntrada, setTiposEntrada] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stockTotal, setStockTotal] = useState('');
    const [fechaInicioVenta, setFechaInicioVenta] = useState('');
    const [fechaFinVenta, setFechaFinVenta] = useState('');

    const [editingId, setEditingId] = useState<number | null>(null);

    const loadTiposEntrada = async () => {
        setLoading(true);
        try {
            const data = await eventoService.getTiposEntrada(evento.id);
            setTiposEntrada(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar los tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTiposEntrada();
    }, [evento.id]);

    const handleEdit = (t: any) => {
        setEditingId(t.id);
        setNombre(t.nombre);
        setPrecio(t.precio.toString());
        setStockTotal(t.stockTotal.toString());
        setFechaInicioVenta(t.fechaInicioVenta ? new Date(t.fechaInicioVenta).toISOString().slice(0, 16) : '');
        setFechaFinVenta(t.fechaFinVenta ? new Date(t.fechaFinVenta).toISOString().slice(0, 16) : '');
        setShowForm(true);
    };

    const handleDeactivate = async (t: any) => {
        if (!t.activo) return;
        if (window.confirm("¿Seguro que deseas desactivar este ticket? Ya no estará disponible para la venta.")) {
            try {
                await eventoService.desactivarTipoEntrada(evento.id, t.id);
                toast.success("Ticket desactivado exitosamente");
                loadTiposEntrada();
            } catch (error) {
                console.error(error);
                toast.error("Error al desactivar el ticket");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await eventoService.updateTipoEntrada(evento.id, editingId, {
                    nombre,
                    precio: parseFloat(precio),
                    stockTotal: parseInt(stockTotal, 10),
                    fechaInicioVenta,
                    fechaFinVenta
                });
                toast.success("Ticket actualizado exitosamente");
            } else {
                await eventoService.createTipoEntrada(evento.id, {
                    nombre,
                    precio: parseFloat(precio),
                    stockTotal: parseInt(stockTotal, 10),
                    fechaInicioVenta,
                    fechaFinVenta
                });
                toast.success("Ticket creado exitosamente");
            }
            setShowForm(false);
            
            // Reset form
            setEditingId(null);
            setNombre('');
            setPrecio('');
            setStockTotal('');
            setFechaInicioVenta('');
            setFechaFinVenta('');
            
            loadTiposEntrada();
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar el ticket");
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setNombre('');
        setPrecio('');
        setStockTotal('');
        setFechaInicioVenta('');
        setFechaFinVenta('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Ticket size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white m-0">Tickets del Evento</h2>
                            <p className="text-sm text-gray-400 m-0 mt-1">{evento.titulo}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    
                    {!showForm ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-200">Tipos de Entradas Configurados</h3>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    Agregar Ticket
                                </button>
                            </div>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-16 bg-gray-800 rounded-lg"></div>
                                    <div className="h-16 bg-gray-800 rounded-lg"></div>
                                </div>
                            ) : tiposEntrada.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30">
                                    <Ticket size={48} className="mx-auto text-gray-500 mb-4 opacity-50" />
                                    <p className="text-gray-400">No hay tickets configurados para este evento.</p>
                                </div>
                            ) : (
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Nombre</Th>
                                            <Th>Precio</Th>
                                            <Th>Stock</Th>
                                            <Th>Periodo de Venta</Th>
                                            <Th>Estado</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tiposEntrada.map((t) => (
                                            <Tr key={t.id}>
                                                <Td className="font-bold text-white">{t.nombre}</Td>
                                                <Td className="text-green-400 font-semibold">${t.precio}</Td>
                                                <Td>
                                                    <span className="text-white">{t.stockDisponible}</span> / <span className="text-gray-400">{t.stockTotal}</span>
                                                </Td>
                                                <Td className="text-xs text-gray-400">
                                                    <div>{new Date(t.fechaInicioVenta).toLocaleDateString()} al</div>
                                                    <div>{new Date(t.fechaFinVenta).toLocaleDateString()}</div>
                                                </Td>
                                                <Td>
                                                    {t.activo ? <Badge variant="success">Activo</Badge> : <Badge variant="danger">Inactivo</Badge>}
                                                </Td>
                                                <Td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(t)}
                                                            className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors"
                                                            title="Editar Ticket"
                                                        >
                                                            <Ticket size={16} />
                                                        </button>
                                                        {t.activo && (
                                                            <button
                                                                onClick={() => handleDeactivate(t)}
                                                                className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                                                                title="Desactivar Ticket"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-lg font-semibold text-white mb-4">{editingId ? 'Editar Tipo de Entrada' : 'Nuevo Tipo de Entrada'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre (ej: VIP, General)</label>
                                    <input 
                                        type="text" required
                                        value={nombre} onChange={e => setNombre(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Precio ($)</label>
                                    <input 
                                        type="number" step="0.01" min="0" required
                                        value={precio} onChange={e => setPrecio(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Stock (Capacidad)</label>
                                    <input 
                                        type="number" min="1" required
                                        value={stockTotal} onChange={e => setStockTotal(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Inicio de Venta</label>
                                    <input 
                                        type="datetime-local" required
                                        value={fechaInicioVenta} onChange={e => setFechaInicioVenta(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Fin de Venta</label>
                                    <input 
                                        type="datetime-local" required
                                        value={fechaFinVenta} onChange={e => setFechaFinVenta(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    className="px-5 py-2.5 text-gray-300 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    <Save size={18} />
                                    {editingId ? 'Guardar Cambios' : 'Guardar Ticket'}
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TipoEntradaModal;
