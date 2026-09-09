import { useState, useEffect } from 'react';
import { eventoService, Evento } from '../services/eventoService';

export const useEventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const cargarEventos = async () => {
        try {
            setLoading(true);
            const data = await eventoService.getEventos(0, 100);
            
            // FILTRO DE SEGURIDAD FRONTEND: Ocultar eventos de ayer
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Limpiamos horas para comparar solo el día

            const eventList = Array.isArray(data) ? data : (data.content || []);
            const eventosFuturos = eventList.filter((evento: Evento) => {
                const fechaEvento = new Date(evento.fecha);
                return fechaEvento >= hoy;
            });

            setEventos(eventosFuturos);
        } catch (err: any) {
            setError("No se pudieron cargar los eventos. Intenta más tarde.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEventos();
    }, []);

    // Devolvemos también 'cargarEventos' por si quieres un botón de "Refrescar"
    return { eventos, loading, error, refrescar: cargarEventos };
};
