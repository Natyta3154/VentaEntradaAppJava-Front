import api from '../api/api';
import { User } from '../types';

export interface LoginCredentials {
    username?: string; // Por si usa username
    email?: string;    // Por si usa email
    password?: string; // Opcional para soportar diferentes estructuras
}

export const authService = {
    // Función para registrar nuevos usuarios
    registro: async (userData: any): Promise<User> => {
        try {
            const response = await api.post('api/usuarios/registro', userData);
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data || { mensaje: "Error en el servidor" };
            throw errorMsg;
        }
    },

    // Función para iniciar sesión
    login: async (credentials: LoginCredentials): Promise<User> => {
        try {
            const response = await api.post('api/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { mensaje: "Credenciales inválidas" };
        }
    },

    // Función para verificar sesión (refrescar token)
    getUserInfo: async (): Promise<User> => {
        try {
            const response = await api.post('api/auth/refresh');
            return response.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    },

    // Función para cerrar sesión
    logout: async (): Promise<void> => {
        try {
            await api.post('api/auth/logout');
        } catch (error: any) {
            throw error.response?.data;
        }
    },

    // Función para actualizar perfil de usuario
    updateUserProfile: async (userData: Partial<User>): Promise<User> => {
        try {
            const response = await api.patch<User>('api/user-info/', userData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { mensaje: "Error al actualizar el perfil" };
        }
    }
};

export default authService;
