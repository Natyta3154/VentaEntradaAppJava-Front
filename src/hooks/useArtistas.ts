import { useState, useEffect } from 'react';
import { artistaService, Artista } from '../services/artistaService';

export const useArtistas = () => {
    const [artistas, setArtistas] = useState<Artista[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const cargarArtistas = async () => {
        try {
            setLoading(true);
            const data = await artistaService.getArtistas(0, 100);
            
            const artistasList = Array.isArray(data) ? data : (data.content || []);
            setArtistas(artistasList);
        } catch (err: any) {
            setError("No se pudieron cargar los artistas.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarArtistas();
    }, []);

    return { artistas, loading, error, refrescar: cargarArtistas };
};
