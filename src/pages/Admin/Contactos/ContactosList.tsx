import React, { useEffect, useState } from 'react';
import { contactoService, MensajeContactoAdmin } from '../../../services/contactoService';
import { Mail, CheckCircle, Reply } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td, Badge, TableSkeleton, EmptyState } from '../../../components/UI';
import toast from 'react-hot-toast';

const ContactosList = () => {
    const [mensajes, setMensajes] = useState<MensajeContactoAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [mensajeSeleccionado, setMensajeSeleccionado] = useState<MensajeContactoAdmin | null>(null);
    const [respuesta, setRespuesta] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        cargarMensajes();
    }, []);

    const cargarMensajes = async () => {
        setLoading(true);
        try {
            const data = await contactoService.obtenerContactosAdmin();
            setMensajes(data);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            toast.error('Error al cargar mensajes de contacto');
        } finally {
            setLoading(false);
        }
    };

    const handleMarcarLeido = async (id: number) => {
        try {
            await contactoService.marcarContactoComoLeido(id);
            toast.success('Mensaje marcado como leído');
            cargarMensajes();
        } catch (error) {
            console.error('Error al marcar como leído:', error);
            toast.error('Error al marcar como leído');
        }
    };

    const handleResponder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mensajeSeleccionado) return;
        
        setEnviando(true);
        try {
            await contactoService.responderMensajeContacto(mensajeSeleccionado.id, respuesta);
            toast.success('¡Respuesta enviada exitosamente!');
            setMensajeSeleccionado(null);
            setRespuesta('');
            cargarMensajes();
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
            toast.error('Error al enviar la respuesta');
        } finally {
            setEnviando(false);
        }
    };

    const getEstadoBadge = (leido: boolean) => {
        if (leido) {
            return <Badge variant="success">Leído</Badge>;
        }
        return <Badge variant="warning">Pendiente</Badge>;
    };

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500 relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Mensajes de Contacto</h2>
                    <p className="text-gray-400 mt-1">Gestiona y responde las consultas de los usuarios.</p>
                </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} columns={5} />
                ) : mensajes.length === 0 ? (
                    <EmptyState 
                        title="No hay mensajes" 
                        description="Aún no se han recibido mensajes de contacto."
                    />
                ) : (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Remitente</Th>
                                <Th>Asunto</Th>
                                <Th>Fecha</Th>
                                <Th>Estado</Th>
                                <Th className="text-right">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {mensajes.map((msg) => (
                                <Tr key={msg.id} className={!msg.leido ? 'bg-gray-700/30' : ''}>
                                    <Td className="text-gray-400">#{msg.id}</Td>
                                    <Td>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{msg.nombre}</span>
                                            <span className="text-sm text-gray-400 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {msg.email}
                                            </span>
                                        </div>
                                    </Td>
                                    <Td>
                                        <span className="font-medium text-gray-300">{msg.asunto}</span>
                                    </Td>
                                    <Td>{new Date(msg.fechaEnvio).toLocaleString()}</Td>
                                    <Td>{getEstadoBadge(msg.leido)}</Td>
                                    <Td>
                                        <div className="flex justify-end gap-2">
                                            {!msg.leido && (
                                                <button 
                                                    onClick={() => handleMarcarLeido(msg.id)}
                                                    className="p-2 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                                                    title="Marcar como Leído"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setMensajeSeleccionado(msg)}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                title="Ver y Responder"
                                            >
                                                <Reply className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>

            {/* Modal para Responder */}
            {mensajeSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Reply className="w-5 h-5 text-blue-500" />
                                Responder Mensaje
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Respondiendo a <span className="font-medium text-gray-300">{mensajeSeleccionado.nombre}</span> ({mensajeSeleccionado.email})
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Mensaje Original</h4>
                                <p className="text-gray-300 font-medium mb-1">{mensajeSeleccionado.asunto}</p>
                                <p className="text-gray-400 text-sm whitespace-pre-wrap">{mensajeSeleccionado.mensaje}</p>
                            </div>

                            <form onSubmit={handleResponder} className="space-y-4">
                                <div>
                                    <label htmlFor="respuesta" className="block text-sm font-medium text-gray-300 mb-2">
                                        Tu Respuesta
                                    </label>
                                    <textarea 
                                        id="respuesta"
                                        rows={6} 
                                        value={respuesta} 
                                        onChange={(e) => setRespuesta(e.target.value)}
                                        placeholder="Escribe la respuesta que será enviada por correo..."
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
                                    <button 
                                        type="button" 
                                        onClick={() => setMensajeSeleccionado(null)} 
                                        disabled={enviando}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={enviando}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {enviando ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4" />
                                                Enviar Respuesta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactosList;
