import React, { useEffect, useState } from 'react';
import { artistaService, Artista } from '../../../services/artistaService';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import ArtistaForm from './ArtistaForm';
import { Table, Thead, Tbody, Tr, Th, Td, ConfirmModal, TableSkeleton, FilterBar, EmptyState } from '../../../components/UI';
import toast from 'react-hot-toast';

const ArtistasList = () => {
    const [artistas, setArtistas] = useState<Artista[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [artistaToEdit, setArtistaToEdit] = useState<Artista | undefined>(undefined);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [artistaToDelete, setArtistaToDelete] = useState<Artista | null>(null);

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    const loadArtistas = async () => {
        setLoading(true);
        try {
            const data = await artistaService.getArtistas(0, 50, searchTerm || undefined);
            setArtistas(Array.isArray(data) ? data : (data.content || []));
        } catch (error) {
            console.error("Error cargando artistas:", error);
            toast.error("No se pudieron cargar los artistas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadArtistas();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleEdit = (artista: Artista) => {
        setArtistaToEdit(artista);
        setShowForm(true);
    };

    const handleCreate = () => {
        setArtistaToEdit(undefined);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        loadArtistas();
    };

    const confirmDelete = (artista: Artista) => {
        setArtistaToDelete(artista);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!artistaToDelete) return;
        try {
            await artistaService.deleteArtista(artistaToDelete.id);
            toast.success("Artista eliminado exitosamente");
            loadArtistas();
        } catch (error) {
            console.error("Error eliminando artista:", error);
            toast.error("Error al eliminar el artista");
        } finally {
            setShowDeleteModal(false);
            setArtistaToDelete(null);
        }
    };

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Artistas y DJs</h2>
                    <p className="text-gray-400 mt-1">Gestiona los artistas que participarán en tus eventos.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Artista
                </button>
            </div>
            
            <FilterBar 
                onSearch={setSearchTerm} 
                placeholder="Buscar por nombre o estilo..." 
            />
            
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden overflow-x-auto w-full">
                {loading ? (
                    <TableSkeleton rows={5} columns={4} />
                ) : artistas.length === 0 ? (
                    <EmptyState 
                        title="No hay artistas" 
                        description={searchTerm ? "No se encontraron artistas con esa búsqueda." : "Agrega tu primer artista para luego asignarlo a los eventos."}
                        action={!searchTerm ? (
                            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                Crear Artista
                            </button>
                        ) : undefined}
                    />
                ) : (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Artista</Th>
                                <Th>Estilo Musical</Th>
                                <Th className="text-right">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {artistas.map((artista) => (
                                <Tr key={artista.id}>
                                    <Td className="text-gray-400">#{artista.id}</Td>
                                    <Td>
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            {artista.foto ? (
                                                <img src={artista.foto} alt={artista.nombre} className="w-10 h-10 rounded-full object-cover border border-gray-600" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-white">{artista.nombre}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{artista.biografia}</div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>
                                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium">
                                            {artista.estiloMusical || 'No definido'}
                                        </span>
                                    </Td>
                                    <Td>
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(artista)}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                title="Editar Artista"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(artista)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                title="Eliminar Artista"
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
                <ArtistaForm 
                    artista={artistaToEdit} 
                    onClose={() => setShowForm(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}

            <ConfirmModal 
                isOpen={showDeleteModal}
                title="Eliminar Artista"
                message={`¿Estás seguro que deseas eliminar al artista "${artistaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setArtistaToDelete(null);
                }}
                isDestructive={true}
            />
        </div>
    );
};

export default ArtistasList;
