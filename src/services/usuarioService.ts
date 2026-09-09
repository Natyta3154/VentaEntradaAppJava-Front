import api from '../api/api';
import { User, PaginatedResponse } from '../types';

export type Usuario = User;

export const usuarioService = {
    getUsuarios: async (page = 0, size = 50): Promise<PaginatedResponse<User> | User[]> => {
        const response = await api.get('/api/usuarios', {
            params: { page, size }
        });
        
        if (response.data && response.data.content) {
            return response.data as PaginatedResponse<User>;
        }
        
        return response.data as User[];
    },

    cambiarRol: async (id: number, nuevoRol: string): Promise<User> => {
        const response = await api.put(`/api/usuarios/${id}/rol`, { nuevoRol });
        return response.data;
    },

    editarUsuario: async (id: number, usuario: Partial<User> | {nombre?: string, apellido?: string, email?: string}): Promise<User> => {
        const response = await api.put(`/api/usuarios/${id}`, usuario);
        return response.data;
    },

    eliminarUsuario: async (id: number): Promise<void> => {
        await api.delete(`/api/usuarios/${id}`);
    }
};

export default usuarioService;
