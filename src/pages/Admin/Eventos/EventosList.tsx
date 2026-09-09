import React, { useEffect, useState } from 'react';
import { eventoService, Evento } from '../../../services/eventoService';
import { Plus, Edit2, Trash2, Ticket as TicketIcon } from 'lucide-react';
import EventoForm from './EventoForm';
import TipoEntradaModal from './TipoEntradaModal';
import { Table, Thead, Tbody, Tr, Th, Td, Badge, ConfirmModal, TableSkeleton, FilterBar, EmptyState } from '../../../components/UI';
import toast from 'react-hot-toast';

const EventosList = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [eventoToEdit, setEventoToEdit] = useState<Evento | undefined>(undefined);
    
    // Tickets Modal State
    const [showTicketsModal, setShowTicketsModal] = useState(false);
    const [eventoForTickets, setEventoForTickets] = useState<Evento | null>(null);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null);

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    const loadEventos = async () => {
        setLoading(true);
        try {
            const data = await eventoService.getEventos(0, 50, searchTerm || undefined); 
            if ('content' in data) {
                setEventos(data.content);
            } else {
                setEventos(data);
            }
        } catch (error) {
            console.error("Error cargando eventos:", error);
            toast.error("No se pudieron cargar los eventos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadEventos();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleEdit = (evento: Evento) => {
        setEventoToEdit(evento);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEventoToEdit(undefined);
        setShowForm(true);
    };

    const handleManageTickets = (evento: Evento) => {
        setEventoForTickets(evento);
        setShowTicketsModal(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        loadEventos();
    };

    const confirmDelete = (evento: Evento) => {
        setEventoToDelete(evento);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!eventoToDelete) return;
        try {
            await eventoService.deleteEvento(eventoToDelete.id);
            toast.success("Evento eliminado exitosamente");
            loadEventos();
        } catch (error) {
            console.error("Error eliminando evento:", error);
            toast.error("Error al eliminar el evento");
        } finally {
            setShowDeleteModal(false);
            setEventoToDelete(null);
        }
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'PUBLICADO':
            case 'VENTA_ABIERTA':
            case 'ACTIVO':
                return <Badge variant="success">{estado.replace('_', ' ')}</Badge>;
            case 'BORRADOR':
            case 'FINALIZADO':
                return <Badge variant="default">{estado}</Badge>;
            case 'AGOTADO':
                return <Badge variant="warning">{estado}</Badge>;
            case 'SUSPENDIDO':
            case 'CANCELADO':
                return <Badge variant="danger">{estado}</Badge>;
            default:
                return <Badge variant="default">{estado}</Badge>;
        }
    };

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Eventos</h2>
                    <p className="text-gray-400 mt-1">Gestiona los eventos, fechas y estados.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Evento
                </button>
            </div>
            
            <FilterBar 
                onSearch={setSearchTerm} 
                placeholder="Buscar por nombre o lugar..." 
            />
            
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} columns={6} />
                ) : eventos.length === 0 ? (
                    <EmptyState 
                        title="No hay eventos" 
                        description={searchTerm ? "No se encontraron eventos con esa búsqueda." : "Crea tu primer evento para comenzar a vender entradas."}
                        action={!searchTerm && (
                            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                Crear Evento
                            </button>
                        )}
                    />
                ) : (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Nombre</Th>
                                <Th>Fecha</Th>
                                <Th>Lugar</Th>
                                <Th>Estado</Th>
                                <Th className="text-right">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {eventos.map((evento) => (
                                <Tr key={evento.id}>
                                    <Td className="text-gray-400">#{evento.id}</Td>
                                    <Td>
                                        <div className="flex items-center gap-3">
                                            {evento.imagenUrl && (
                                                <img src={evento.imagenUrl} alt={evento.titulo} className="w-10 h-10 rounded-lg object-cover" />
                                            )}
                                            <span className="font-medium text-white">{evento.titulo}</span>
                                        </div>
                                    </Td>
                                    <Td>{new Date(evento.fecha).toLocaleString()}</Td>
                                    <Td>{evento.lugar || evento.ciudad}</Td>
                                    <Td>{getEstadoBadge(evento.estado)}</Td>
                                    <Td>
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleManageTickets(evento)}
                                                className="p-2 text-violet-400 hover:bg-violet-400/10 rounded transition-colors"
                                                title="Gestionar Tickets"
                                            >
                                                <TicketIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(evento)}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                title="Editar Evento"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(evento)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                title="Eliminar Evento"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>

            {showForm && (
                <EventoForm 
                    evento={eventoToEdit} 
                    onClose={() => setShowForm(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}

            {showTicketsModal && eventoForTickets && (
                <TipoEntradaModal 
                    evento={eventoForTickets} 
                    onClose={() => {
                        setShowTicketsModal(false);
                        setEventoForTickets(null);
                    }} 
                />
            )}

            <ConfirmModal 
                isOpen={showDeleteModal}
                title="Eliminar Evento"
                message={`¿Estás seguro que deseas eliminar el evento "${eventoToDelete?.titulo}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setEventoToDelete(null);
                }}
                isDestructive={true}
            />
        </div>
    );
};

export default EventosList;
