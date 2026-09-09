import React, { useEffect, useState } from 'react';
import DataTable from '../../../components/Admin/DataTable';
import { artistaService, Artista } from '../../../services/artistaService';
import { Plus } from 'lucide-react';
import ArtistaForm from './ArtistaForm';

const ArtistasList = () => {
    const [artistas, setArtistas] = useState<Artista[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [artistaToEdit, setArtistaToEdit] = useState<Artista | undefined>(undefined);

    const loadArtistas = async () => {
        setLoading(true);
        try {
            const data = await artistaService.getArtistas(0, 50);
            setArtistas(Array.isArray(data) ? data : (data.content || []));
        } catch (error) {
            console.error("Error cargando artistas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArtistas();
    }, []);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'estiloMusical', label: 'Estilo Musical' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'foto', label: 'Foto' },
    ];

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

    const handleDelete = async (artista: Artista) => {
        if (window.confirm(`¿Estás seguro de eliminar el artista "${artista.nombre}"?`)) {
            try {
                await artistaService.deleteArtista(artista.id);
                loadArtistas();
            } catch (error) {
                console.error("Error eliminando artista:", error);
                alert("Error eliminando artista");
            }
        }
    };

    return (
        <div className="p-8 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] m-4 text-gray-200">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h2 className="text-3xl font-bold text-gray-200 m-0 tracking-tight drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">Gestión de Artistas</h2>
                <button 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(217,70,239,0.5)] active:translate-y-0 active:shadow-none relative overflow-hidden group"
                    onClick={handleCreate}
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" /> 
                    Nuevo Artista
                </button>
            </div>
            
            {loading ? (
                <div className="text-center py-10 text-gray-400">Cargando artistas...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={artistas} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showForm && (
                <ArtistaForm 
                    artista={artistaToEdit} 
                    onClose={() => setShowForm(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}
        </div>
    );
};

export default ArtistasList;
