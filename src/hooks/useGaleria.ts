import { useState, useEffect } from 'react';
import { getGaleria, GaleriaMedia } from '../services/galeriaService';

export const useGaleria = (limit?: number) => {
    const [media, setMedia] = useState<GaleriaMedia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const cargarGaleria = async () => {
        try {
            setLoading(true);
            const data = await getGaleria(limit);
            setMedia(data);
        } catch (err: any) {
            setError("No se pudo conectar con la galería.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarGaleria();
    }, [limit]); // Se recarga si el límite cambia

    return { media, loading, error, refrescar: cargarGaleria };
};
