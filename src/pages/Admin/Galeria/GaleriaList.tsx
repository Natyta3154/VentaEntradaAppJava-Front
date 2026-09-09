import React, { useState, useEffect } from 'react';
import { adminGaleriaService, AdminImagen, AdminVideo } from '../../../services/adminGaleriaService';
import { Plus, Edit2, Trash2, Image as ImageIcon, Film } from 'lucide-react';
import GaleriaForm from './GaleriaForm';
import toast from 'react-hot-toast';
import { Table, Thead, Tbody, Tr, Th, Td, TableSkeleton, EmptyState, ConfirmModal } from '../../../components/UI';

type MediaItem = (AdminImagen | AdminVideo) & { tipo: 'imagen' | 'video' };

const GaleriaList = () => {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MediaItem | undefined>(undefined);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

    const loadItems = async () => {
        setLoading(true);
        try {
            // Fetch both images and videos
            const [imgRes, vidRes] = await Promise.all([
                adminGaleriaService.getImagenes(),
                adminGaleriaService.getVideos()
            ]);

            const images: MediaItem[] = (Array.isArray(imgRes) ? imgRes : (imgRes.content || [])).map((img: AdminImagen) => ({
                ...img,
                tipo: 'imagen'
            }));

            const videos: MediaItem[] = (Array.isArray(vidRes) ? vidRes : (vidRes.content || [])).map((vid: AdminVideo) => ({
                ...vid,
                tipo: 'video'
            }));

            const allItems = [...images, ...videos].sort((a, b) => a.orden - b.orden);
            setItems(allItems);
        } catch (err: any) {
            toast.error("Error al cargar la galería: " + (err.response?.data?.mensaje || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const confirmDelete = (item: MediaItem) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (itemToDelete.tipo === 'imagen') {
                await adminGaleriaService.deleteImagen(itemToDelete.id);
            } else {
                await adminGaleriaService.deleteVideo(itemToDelete.id);
            }
            toast.success('Eliminado con éxito');
            loadItems();
        } catch (err: any) {
            toast.error("Error al eliminar: " + (err.response?.data?.mensaje || err.message));
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleEdit = (item: MediaItem) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedItem(undefined);
        setIsFormOpen(true);
    };

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestión de Galería</h2>
                    <p className="text-gray-400 mt-1">Administra imágenes y videos de los eventos.</p>
                </div>
                <button 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    onClick={handleCreate}
                >
                    <Plus size={18} /> 
                    Nuevo Medio
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} columns={6} />
                ) : items.length === 0 ? (
                    <EmptyState 
                        title="No hay medios" 
                        description="No se encontraron imágenes ni videos en la galería."
                    />
                ) : (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Tipo</Th>
                                <Th>Vista Previa</Th>
                                <Th>Título</Th>
                                <Th>ID Evento</Th>
                                <Th>Orden</Th>
                                <Th className="text-right">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {items.map((item) => (
                                <Tr key={`${item.tipo}-${item.id}`}>
                                    <Td>
                                        <div className="p-2 bg-gray-900 rounded-lg inline-block text-gray-400">
                                            {item.tipo === 'imagen' ? <ImageIcon size={20} /> : <Film size={20} />}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="w-16 h-10 rounded-md overflow-hidden bg-gray-900 border border-gray-700">
                                            {item.tipo === 'imagen' ? (
                                                <img src={(item as AdminImagen).urlImagen} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <video src={(item as AdminVideo).urlVideo} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </Td>
                                    <Td className="font-medium text-white">
                                        {item.tipo === 'imagen' ? (item as AdminImagen).nombreImagen : (item as AdminVideo).nombreVideo}
                                    </Td>
                                    <Td className="text-gray-400">
                                        #{item.eventoId}
                                    </Td>
                                    <Td>
                                        <span className="px-2.5 py-1 bg-gray-900 rounded text-gray-300 font-mono text-sm">
                                            {item.orden}
                                        </span>
                                    </Td>
                                    <Td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors" 
                                                onClick={() => handleEdit(item)} title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" 
                                                onClick={() => confirmDelete(item)} title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>

            {isFormOpen && (
                <GaleriaForm
                    item={selectedItem}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        loadItems();
                    }}
                />
            )}

            <ConfirmModal 
                isOpen={showDeleteModal}
                title="Eliminar Medio"
                message={`¿Estás seguro que deseas eliminar "${itemToDelete?.tipo === 'imagen' ? (itemToDelete as AdminImagen).nombreImagen : (itemToDelete as AdminVideo)?.nombreVideo}" de la galería?`}
                confirmText="Sí, Eliminar"
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                }}
                isDestructive={true}
            />
        </div>
    );
};

export default GaleriaList;
