import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Artista, artistaService } from '../../../services/artistaService';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../../api/api';
import toast from 'react-hot-toast';

interface ArtistaFormProps {
    artista?: Artista;
    onClose: () => void;
    onSuccess: () => void;
}

const ArtistaForm: React.FC<ArtistaFormProps> = ({ artista, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Omit<Artista, 'id'>>({
        nombre: '',
        estiloMusical: '',
        biografia: '',
        foto: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (artista) {
            setFormData({
                nombre: artista.nombre || '',
                estiloMusical: artista.estiloMusical || '',
                biografia: artista.biografia || '',
                foto: artista.foto || ''
            });
        }
    }, [artista]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            setUploadingImage(true);
            const response = await api.post('/api/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setFormData(prev => ({ ...prev, foto: response.data.url }));
            toast.success("Imagen subida correctamente");
        } catch (err: any) {
            console.error("Error al subir imagen:", err);
            toast.error("Error al subir la imagen");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (artista) {
                await artistaService.updateArtista(artista.id, formData);
                toast.success('Artista actualizado con éxito');
            } else {
                await artistaService.createArtista(formData);
                toast.success('Artista creado con éxito');
            }
            onSuccess();
        } catch (err: any) {
            console.error("Error al guardar artista:", err);
            toast.error(err.response?.data?.mensaje || err.message || "Error al guardar el artista.");
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex justify-center items-center overflow-y-auto py-10" onClick={onClose}>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative m-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    {artista ? 'Editar Artista' : 'Nuevo Artista'}
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Nombre del Artista</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Estilo Musical</label>
                        <input 
                            type="text" 
                            name="estiloMusical" 
                            value={formData.estiloMusical} 
                            onChange={handleChange} 
                            className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Foto / Imagen de Perfil</label>
                        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ImageIcon size={18} className="text-gray-400" />
                                </div>
                                <input 
                                    type="url" 
                                    name="foto" 
                                    value={formData.foto} 
                                    onChange={handleChange} 
                                    placeholder="https://..."
                                    className="w-full pl-10 p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div className="text-gray-400 text-sm font-medium">O</div>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    disabled={uploadingImage}
                                />
                                <button 
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-gray-600 rounded-lg text-white font-medium transition-colors whitespace-nowrap disabled:opacity-50"
                                    disabled={uploadingImage}
                                >
                                    <Upload size={18} />
                                    {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                                </button>
                            </div>
                        </div>
                        {formData.foto && (
                            <div className="mt-2 relative rounded-full overflow-hidden border border-gray-700 bg-zinc-900 w-24 h-24 flex items-center justify-center">
                                <img src={formData.foto} alt="Vista previa" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Biografía</label>
                        <textarea 
                            name="biografia" 
                            value={formData.biografia} 
                            onChange={handleChange} 
                            rows={4} 
                            className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
                        <button 
                            type="button" 
                            className="px-5 py-2.5 bg-transparent border border-gray-600 rounded-lg text-gray-300 font-medium hover:bg-gray-800 transition-colors" 
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" 
                            disabled={loading}
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Guardando...' : 'Guardar Artista'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ArtistaForm;
