import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Artista, artistaService } from '../../../services/artistaService';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../../services/uploadService';
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (artista) {
            setFormData({
                nombre: artista.nombre,
                estiloMusical: artista.estiloMusical,
                biografia: artista.biografia,
                foto: artista.foto || ''
            });
            if (artista.foto) {
                setPreviewUrl(artista.foto);
            }
        }
    }, [artista]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalFotoUrl = formData.foto;

            if (selectedFile) {
                finalFotoUrl = await uploadImage(selectedFile);
            }

            const dataToSave = { ...formData, foto: finalFotoUrl };

            if (artista) {
                await artistaService.updateArtista(artista.id, dataToSave);
                toast.success('Artista actualizado con éxito');
            } else {
                await artistaService.createArtista(dataToSave);
                toast.success('Artista creado con éxito');
            }
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.mensaje || err.message || "Error al guardar el artista.");
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex justify-center items-center overflow-y-auto py-10" onClick={onClose}>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.5)] relative m-4 text-gray-200" onClick={e => e.stopPropagation()}>
                <button className="absolute top-5 right-5 bg-transparent border-none text-gray-400 hover:text-white cursor-pointer transition-colors p-1 rounded-md hover:bg-white/10" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-violet-400">{artista ? 'Editar Artista' : 'Nuevo Artista'}</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    <div className="text-center mb-5 flex flex-col items-center">
                        <div className="w-[150px] h-[150px] rounded-full mb-4 border-2 border-dashed border-violet-500/50 flex items-center justify-center overflow-hidden bg-zinc-800">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={40} className="text-gray-500" />
                            )}
                        </div>
                        <label className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/10 rounded-xl text-gray-300 font-semibold cursor-pointer transition-all duration-300 hover:border-violet-500 hover:text-violet-500 hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                            <Upload size={18} />
                            Seleccionar Foto
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-300 text-sm tracking-wide">Nombre del Artista</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 bg-zinc-950/50 border border-white/10 rounded-xl text-gray-200 text-base focus:outline-none focus:border-violet-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-300 text-sm tracking-wide">Estilo Musical</label>
                        <input 
                            type="text" 
                            name="estiloMusical" 
                            value={formData.estiloMusical} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 bg-zinc-950/50 border border-white/10 rounded-xl text-gray-200 text-base focus:outline-none focus:border-violet-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-300 text-sm tracking-wide">Biografía</label>
                        <textarea 
                            name="biografia" 
                            value={formData.biografia} 
                            onChange={handleChange} 
                            required 
                            rows={4} 
                            className="w-full p-3 bg-zinc-950/50 border border-white/10 rounded-xl text-gray-200 text-base focus:outline-none focus:border-violet-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all placeholder:text-gray-600 resize-y"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                        <button type="button" className="px-6 py-3 bg-transparent border border-white/10 rounded-xl text-gray-300 font-semibold cursor-pointer transition-all duration-300 hover:border-rose-500 hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(217,70,239,0.5)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ArtistaForm;
