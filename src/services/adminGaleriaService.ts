import api from '../api/api';
import { PaginatedResponse } from '../types';

export interface AdminImagen {
    id: number;
    nombreImagen: string;
    urlImagen: string;
    orden: number;
    eventoId: number;
    fechaCreacion?: string;
}

export interface AdminVideo {
    id: number;
    nombreVideo: string;
    urlVideo: string;
    orden: number;
    eventoId: number;
    fechaCreacion?: string;
}

export const adminGaleriaService = {
    // IMAGENES
    getImagenes: async (page = 0, size = 100): Promise<PaginatedResponse<AdminImagen> | AdminImagen[]> => {
        const response = await api.get('/api/imagenes/todas', {
            params: { page, size }
        });
        return response.data;
    },

    createImagen: async (data: Omit<AdminImagen, 'id' | 'fechaCreacion'>): Promise<AdminImagen> => {
        const response = await api.post('/api/imagenes/crearImagen', data);
        return response.data;
    },

    updateImagen: async (id: number, data: Omit<AdminImagen, 'id' | 'fechaCreacion'>): Promise<AdminImagen> => {
        const response = await api.put(`/api/imagenes/actualizarImagen/${id}`, data);
        return response.data;
    },

    deleteImagen: async (id: number): Promise<void> => {
        await api.delete(`/api/imagenes/eliminarImagen/${id}`);
    },

    // VIDEOS
    getVideos: async (page = 0, size = 100): Promise<PaginatedResponse<AdminVideo> | AdminVideo[]> => {
        const response = await api.get('/api/videos/todos', {
            params: { page, size }
        });
        return response.data;
    },

    createVideo: async (data: Omit<AdminVideo, 'id' | 'fechaCreacion'>): Promise<AdminVideo> => {
        const response = await api.post('/api/videos', data);
        return response.data;
    },

    updateVideo: async (id: number, data: Omit<AdminVideo, 'id' | 'fechaCreacion'>): Promise<AdminVideo> => {
        const response = await api.put(`/api/videos/${id}`, data);
        return response.data;
    },

    deleteVideo: async (id: number): Promise<void> => {
        await api.delete(`/api/videos/${id}`);
    }
};

export default adminGaleriaService;
