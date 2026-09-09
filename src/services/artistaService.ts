import api from '../api/api';
import { Artista, PaginatedResponse } from '../types';

export type { Artista };

export const artistaService = {
    getArtistas: async (page = 0, size = 50, nombre?: string): Promise<PaginatedResponse<Artista> | Artista[]> => {
        const response = await api.get('/api/artistas', {
            params: { page, size, nombre }
        });
        
        // Handle both paginated and non-paginated responses gracefully
        if (response.data && response.data.content) {
            // It's a PaginatedResponse
            const content = response.data.content.map((e: any) => ({
                id: e.id,
                nombre: e.nombre,
                biografia: e.descripcion || e.biografia,
                estiloMusical: e.estilo || e.estiloMusical,
                foto: e.foto
            }));
            return {
                ...response.data,
                content
            } as PaginatedResponse<Artista>;
        } else if (Array.isArray(response.data)) {
            // It's a plain array
            return response.data.map((e: any) => ({
                id: e.id,
                nombre: e.nombre,
                biografia: e.descripcion || e.biografia,
                estiloMusical: e.estilo || e.estiloMusical,
                foto: e.foto
            })) as Artista[];
        }
        
        return response.data;
    },

    getArtistaById: async (id: number | string): Promise<Artista> => {
        const response = await api.get(`/api/artistas/${id}`);
        const e = response.data;
        return {
            id: e.id,
            nombre: e.nombre,
            biografia: e.descripcion || e.biografia,
            estiloMusical: e.estilo || e.estiloMusical,
            foto: e.foto
        };
    },

    createArtista: async (artistaData: Omit<Artista, 'id'>): Promise<Artista> => {
        // Map frontend fields to backend fields if necessary (estiloMusical -> estilo)
        const payload = {
            nombre: artistaData.nombre,
            descripcion: artistaData.biografia,
            estiloMusical: artistaData.estiloMusical,
            foto: artistaData.foto
        };
        const response = await api.post('/api/artistas', payload);
        return response.data;
    },

    updateArtista: async (id: number, artistaData: Partial<Artista>): Promise<Artista> => {
        const payload = {
            nombre: artistaData.nombre,
            descripcion: artistaData.biografia,
            estiloMusical: artistaData.estiloMusical,
            foto: artistaData.foto

        };

       
        const response = await api.put(`/api/artistas/${id}`, payload);
        return response.data;
    },

    deleteArtista: async (id: number): Promise<void> => {
        await api.delete(`/api/artistas/${id}`);
    }
};

export default artistaService;
