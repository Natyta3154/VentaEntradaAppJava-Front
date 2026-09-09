import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Film, Image as ImageIcon, Save } from 'lucide-react';
import { uploadImage } from '../../../services/uploadService';
import { adminGaleriaService, AdminImagen, AdminVideo } from '../../../services/adminGaleriaService';
import { eventoService, Evento } from '../../../services/eventoService';
import toast from 'react-hot-toast';

interface GaleriaFormProps {
    item?: (AdminImagen | AdminVideo) & { tipo: 'imagen' | 'video' };
    onClose: () => void;
    onSuccess: () => void;
}

const GaleriaForm: React.FC<GaleriaFormProps> = ({ item, onClose, onSuccess }) => {
    const [tipo, setTipo] = useState<'imagen' | 'video'>(item?.tipo || 'imagen');
    const [formData, setFormData] = useState({
        nombre: item ? (item.tipo === 'imagen' ? (item as AdminImagen).nombreImagen : (item as AdminVideo).nombreVideo) : '',
        url: item ? (item.tipo === 'imagen' ? (item as AdminImagen).urlImagen : (item as AdminVideo).urlVideo) : '',
        orden: item?.orden || 0,
        eventoId: item?.eventoId || ''
    });

    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(formData.url);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const data = await eventoService.getEventos(0, 100);
                setEventos(Array.isArray(data) ? data : (data.content || []));
            } catch (err) {
                toast.error("Error al cargar los eventos");
            }
        };
        fetchEventos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'orden' || name === 'eventoId' ? Number(value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            if (tipo === 'imagen') {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(''); // No preview for local video files in this simple implementation
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.eventoId) {
            toast.error("Debes seleccionar un evento");
            return;
        }

        setLoading(true);

        try {
            let finalUrl = formData.url;

            // If a file was selected, upload it via our upload service (Cloudinary)
            if (selectedFile) {
                finalUrl = await uploadImage(selectedFile);
            }

            if (!finalUrl) {
                toast.error("La URL del archivo es requerida. Sube un archivo o pega una URL.");
                setLoading(false);
                return;
            }

            if (tipo === 'imagen') {
                const payload = {
                    nombreImagen: formData.nombre,
                    urlImagen: finalUrl,
                    orden: formData.orden,
                    eventoId: Number(formData.eventoId)
                };

                if (item && item.id) {
                    await adminGaleriaService.updateImagen(item.id, payload);
                    toast.success('Imagen actualizada con éxito');
                } else {
                    await adminGaleriaService.createImagen(payload);
                    toast.success('Imagen creada con éxito');
                }
            } else {
                const payload = {
                    nombreVideo: formData.nombre,
                    urlVideo: finalUrl,
                    orden: formData.orden,
                    eventoId: Number(formData.eventoId)
                };

                if (item && item.id) {
                    await adminGaleriaService.updateVideo(item.id, payload);
                    toast.success('Video actualizado con éxito');
                } else {
                    await adminGaleriaService.createVideo(payload);
                    toast.success('Video creado con éxito');
                }
            }
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.mensaje || err.message || "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex justify-center items-center py-6 px-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white m-0">
                        {item ? 'Editar Medio' : 'Nuevo Medio (Galería)'}
                    </h2>
                    <button 
                        className="text-gray-400 hover:text-white transition-colors" 
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="galeriaForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {!item && (
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-2 cursor-pointer transition-colors px-4 py-2 rounded-lg border ${tipo === 'imagen' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
                                    <input 
                                        type="radio" 
                                        name="tipo" 
                                        checked={tipo === 'imagen'} 
                                        onChange={() => setTipo('imagen')}
                                        className="hidden"
                                    />
                                    <ImageIcon size={18} /> Imagen
                                </label>
                                <label className={`flex items-center gap-2 cursor-pointer transition-colors px-4 py-2 rounded-lg border ${tipo === 'video' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
                                    <input 
                                        type="radio" 
                                        name="tipo" 
                                        checked={tipo === 'video'} 
                                        onChange={() => setTipo('video')}
                                        className="hidden"
                                    />
                                    <Film size={18} /> Video
                                </label>
                            </div>
                        )}

                        <div className="text-center flex flex-col items-center">
                            <div className="w-[200px] h-[150px] rounded-lg mb-4 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden bg-gray-900">
                                {tipo === 'imagen' && previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : tipo === 'video' && previewUrl ? (
                                    <video src={previewUrl} className="w-full h-full object-cover" controls />
                                ) : (
                                    tipo === 'imagen' ? <ImageIcon size={40} className="text-gray-600" /> : <Film size={40} className="text-gray-600" />
                                )}
                            </div>
                            
                            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium cursor-pointer hover:bg-gray-700 hover:text-white transition-colors">
                                <Upload size={18} />
                                Seleccionar Archivo ({tipo})
                                <input 
                                    type="file" 
                                    accept={tipo === 'imagen' ? "image/*" : "video/*"}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {selectedFile && <p className="mt-2 text-sm text-green-400 font-medium truncate max-w-xs">{selectedFile.name}</p>}
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="font-medium text-gray-300 text-sm">URL directa (Opcional, si no subes archivo)</label>
                            <input 
                                type="text" 
                                name="url" 
                                value={formData.url} 
                                onChange={handleChange} 
                                placeholder={`https://ejemplo.com/${tipo}...`} 
                                className="w-full px-4 py-2 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Título / Nombre del Medio</label>
                            <input 
                                type="text" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-300 text-sm">Evento Asociado</label>
                                <select 
                                    name="eventoId" 
                                    value={formData.eventoId} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-4 py-2 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Seleccione un evento</option>
                                    {eventos.map(ev => (
                                        <option key={ev.id} value={ev.id}>{ev.titulo}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-300 text-sm">Orden</label>
                                <input 
                                    type="number" 
                                    name="orden" 
                                    value={formData.orden} 
                                    onChange={handleChange} 
                                    min="0"
                                    className="w-full px-4 py-2 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                    <button 
                        type="button" 
                        className="px-5 py-2.5 bg-transparent border border-gray-600 rounded-lg text-gray-300 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50" 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="galeriaForm"
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" 
                        disabled={loading}
                    >
                        <Save size={18} />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default GaleriaForm;
