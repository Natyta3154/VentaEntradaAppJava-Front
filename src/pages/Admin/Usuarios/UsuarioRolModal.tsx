import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Usuario, usuarioService } from '../../../services/usuarioService';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface UsuarioRolModalProps {
    usuario: Usuario;
    onClose: () => void;
    onSuccess: () => void;
}

const UsuarioRolModal: React.FC<UsuarioRolModalProps> = ({ usuario, onClose, onSuccess }) => {
    const [rol, setRol] = useState(usuario.rol || 'ROLE_CLIENTE');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rol === usuario.rol) {
            onClose(); // No change
            return;
        }

        setLoading(true);

        try {
            await usuarioService.cambiarRol(usuario.id, rol);
            onSuccess();
        } catch (err: any) {
            console.error("Error cambiando rol", err);
            toast.error(err.response?.data?.mensaje || "Error al cambiar el rol.");
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex justify-center items-center py-10" onClick={onClose}>
            <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl relative m-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-2 text-white">Cambiar Rol</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Usuario: <strong className="text-gray-200">{usuario.email}</strong>
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-300 text-sm">Seleccionar Rol</label>
                        <select 
                            value={rol} 
                            onChange={(e) => setRol(e.target.value as any)} 
                            required
                            className="w-full p-3 bg-zinc-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                            <option value="ROLE_CLIENTE">Cliente Normal (Comprador)</option>
                            <option value="ROLE_PORTERO">Validador (Staff / Portero)</option>
                            <option value="ROLE_ADMIN">Administrador (Acceso Total)</option>
                        </select>
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
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default UsuarioRolModal;
