import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Evento, eventoService } from '../../../services/eventoService';
import { artistaService, Artista } from '../../../services/artistaService';
import api from '../../../api/api';
import { X, Save, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface EventoFormProps {
    evento?: Evento;
    onClose: () => void;
    onSuccess: () => void;
}

const EventoForm: React.FC<EventoFormProps> = ({ evento, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<Evento>>({
        titulo: '',
        descripcion: '',
        lugar: '',
        ciudad: '',
        capacidadTotal: 1000,
        edadMinima: 18,
        fecha: '',
        fechaFin: '',
        hora: '',
        estado: 'PUBLICADO',
        imagenUrl: ''
    });
    const [artistasOptions, setArtistasOptions] = useState<Artista[]>([]);
    const [selectedArtistas, setSelectedArtistas] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

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
            
            setFormData(prev => ({ ...prev, imagenUrl: response.data.url }));
            toast.success("Imagen subida correctamente");
        } catch (err: any) {
            console.error("Error al subir imagen:", err);
            toast.error("Error al subir la imagen");
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await artistaService.getArtistas();
                const data = 'content' in response && response.content ? response.content : (Array.isArray(response) ? response : []);
                setArtistasOptions(data);
            } catch (err) {
                console.error("Error fetching artists", err);
            }
        };
        fetchArtistas();
    }, []);

    useEffect(() => {
        if (evento) {
            setFormData({
                titulo: evento.titulo || '',
                descripcion: evento.descripcion || '',
                lugar: evento.lugar || '',
                ciudad: evento.ciudad || '',
                capacidadTotal: evento.capacidadTotal || 1000,
                edadMinima: evento.edadMinima || 18,
                fecha: evento.fecha || '',
                fechaFin: evento.fechaFin || '',
                hora: evento.hora || '',
                estado: evento.estado || 'PUBLICADO',
                imagenUrl: evento.imagenUrl || ''
            });

            const fetchAssigned = async () => {
                try {
                    const arts = await eventoService.getArtistasEvento(evento.id);
                    if (arts && Array.isArray(arts)) {
                        setSelectedArtistas(arts.map((a: any) => a.id));
                    }
                } catch (err) {
                    console.error("Error fetching assigned artists", err);
                }
            };
            fetchAssigned();
        } else {
            setSelectedArtistas([]);
        }
    }, [evento]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'capacidadTotal' || name === 'edadMinima') ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let savedEventoId;
            if (evento) {
                await eventoService.updateEvento(evento.id, formData);
                savedEventoId = evento.id;
                toast.success("Evento actualizado correctamente");
            } else {
                // Ensure required fields for creation
                const createData = {
                    ...formData,
                    titulo: formData.titulo || 'Nuevo Evento',
                    descripcion: formData.descripcion || '',
                    fecha: formData.fecha || new Date().toISOString(),
                    fechaFin: formData.fechaFin || formData.fecha || new Date().toISOString(),
                    lugar: formData.lugar || '',
                    ciudad: formData.ciudad || '',
                    estado: formData.estado as any,
                    capacidadTotal: formData.capacidadTotal || 1000,
                    edadMinima: formData.edadMinima || 18,
                    organizadorId: 1 // Default organizer for now
                };
                const newEvento = await eventoService.createEvento(createData as any);
                savedEventoId = newEvento.id;
                toast.success("Evento creado correctamente");
            }

            if (savedEventoId) {
                try {
                    await eventoService.asignarArtistas(savedEventoId, selectedArtistas);
                } catch (err) {
                    console.error("Error assigning artists", err);
                    toast.error("El evento se guardó, pero hubo un error al asignar los artistas.");
                }
            }

            onSuccess();
        } catch (err: any) {
            console.error("Error al guardar evento:", err);
            toast.error(err.response?.data?.mensaje || "Error al guardar el evento.");
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
                    {evento ? 'Editar Evento' : 'Nuevo Evento'}
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Título del Evento</label>
                            <input 
                                type="text" 
                                name="titulo" 
                                value={formData.titulo} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Estado</label>
                            <select 
                                name="estado" 
                                value={formData.estado} 
                                onChange={handleChange} 
                                required
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            >
                                <option value="BORRADOR">Borrador</option>
                                <option value="PUBLICADO">Publicado</option>
                                <option value="VENTA_ABIERTA">Venta Abierta</option>
                                <option value="AGOTADO">Agotado</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="SUSPENDIDO">Suspendido</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Fecha Inicio</label>
                            <input 
                                type="datetime-local" 
                                name="fecha" 
                                value={formData.fecha ? new Date(formData.fecha).toISOString().slice(0, 16) : ''} 
                                onChange={(e) => setFormData(prev => ({ ...prev, fecha: new Date(e.target.value).toISOString() }))}
                                required 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Fecha Fin</label>
                            <input 
                                type="datetime-local" 
                                name="fechaFin" 
                                value={formData.fechaFin ? new Date(formData.fechaFin).toISOString().slice(0, 16) : ''} 
                                onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: new Date(e.target.value).toISOString() }))}
                                required 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Capacidad Total</label>
                            <input 
                                type="number" 
                                name="capacidadTotal" 
                                value={formData.capacidadTotal} 
                                onChange={handleChange} 
                                required 
                                min="1" 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Edad Mínima</label>
                            <input 
                                type="number" 
                                name="edadMinima" 
                                value={formData.edadMinima} 
                                onChange={handleChange} 
                                required 
                                min="0" 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Lugar / Establecimiento</label>
                            <input 
                                type="text" 
                                name="lugar" 
                                value={formData.lugar} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-300 text-sm">Ciudad</label>
                            <input 
                                type="text" 
                                name="ciudad" 
                                value={formData.ciudad} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="font-medium text-gray-300 text-sm">Artistas Asignados</label>
                            <select 
                                multiple
                                value={selectedArtistas.map(String)} 
                                onChange={(e) => {
                                    const options = Array.from(e.target.options);
                                    setSelectedArtistas(options.filter(o => o.selected).map(o => parseInt(o.value)));
                                }} 
                                className="w-full p-3 bg-zinc-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px]"
                            >
                                {artistasOptions.map(artista => (
                                    <option key={artista.id} value={artista.id}>{artista.nombre}</option>
                                ))}
                            </select>
                            <span className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar varios artistas.</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Imagen de Portada</label>
                        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ImageIcon size={18} className="text-gray-400" />
                                </div>
                                <input 
                                    type="url" 
                                    name="imagenUrl" 
                                    value={formData.imagenUrl} 
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
                        {formData.imagenUrl && (
                            <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-700 bg-zinc-900 w-32 h-20">
                                <img src={formData.imagenUrl} alt="Vista previa" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Descripción</label>
                        <textarea 
                            name="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            required 
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
                            {loading ? 'Guardando...' : 'Guardar Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default EventoForm;
