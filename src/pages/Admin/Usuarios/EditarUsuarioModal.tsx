import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usuarioService, Usuario } from '../../../services/usuarioService';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
    usuario: Usuario;
    onClose: () => void;
    onSuccess: () => void;
}

const EditarUsuarioModal = ({ usuario, onClose, onSuccess }: Props) => {
    const [nombre, setNombre] = useState(usuario.nombre || '');
    const [apellido, setApellido] = useState(usuario.apellido || '');
    const [email, setEmail] = useState(usuario.email || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setNombre(usuario.nombre || '');
        setApellido(usuario.apellido || '');
        setEmail(usuario.email || '');
    }, [usuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await usuarioService.editarUsuario(usuario.id, {
                ...usuario,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email: email.trim()
            });
            onSuccess();
        } catch (error: any) {
            console.error('Error editando usuario:', error);
            const msg = error.response?.data?.mensaje || 
                        error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Error al editar el usuario.';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex justify-center items-center py-10" onClick={onClose}>
            <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl relative m-4 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <button 
                    className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-1 text-white">Editar Usuario</h2>
                <p className="text-sm text-gray-400 mb-6">ID #{usuario.id} - {usuario.email}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Juan"
                            className="w-full p-3 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Ej. Pérez"
                            className="w-full p-3 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
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
                            disabled={saving}
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default EditarUsuarioModal;
