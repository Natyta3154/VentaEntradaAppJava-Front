import api from '../api/api';

export interface GaleriaMedia {
    id: number;
    titulo: string;
    archivo_url: string;
    thumbnail_url: string;
    categoria: 'evento' | 'promo' | 'dj';
    es_video: boolean;
    fecha_subida: string;
}

/**
 * Obtiene la lista completa de la galería de medios.
 */
export const getGaleria = async (limit?: number): Promise<GaleriaMedia[]> => {
    try {
        const url = limit ? `api/imagenes/todas?size=${limit}` : 'api/imagenes/todas';
        const response = await api.get<any>(url);
        return response.data.content.map((e: any) => ({
            id: e.id,
            titulo: e.nombreImagen || 'Imagen de Evento',
            archivo_url: e.urlImagen,
            thumbnail_url: e.urlImagen,
            categoria: 'evento',
            es_video: false,
            fecha_subida: new Date().toISOString()
        }));
    } catch (error: any) {
        console.error("Error en el servicio de galería:", error.response || error.message);
        throw error;
    }
};
