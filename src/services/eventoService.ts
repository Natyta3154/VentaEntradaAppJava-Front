import api from '../api/api';
import { Evento, TicketType, PaginatedResponse } from '../types';

export type { Evento, TicketType };

export const eventoService = {
    getEventos: async (page = 0, size = 10, nombre?: string): Promise<PaginatedResponse<Evento> | Evento[]> => {
        const response = await api.get('/api/eventos', {
            params: { page, size, nombre }
        });
        
        const mapEvento = (e: any): Evento => {
            let ciudad = e.ciudad;
            let lugar = e.lugar;
            let direccion = e.direccion || e.direccionEvento;

            if (e.ubicacion) {
                if (e.ubicacion.includes(',')) {
                    const parts = e.ubicacion.split(',').map((s: string) => s.trim());
                    if (!lugar) lugar = parts[0];
                    if (!ciudad) ciudad = parts.slice(1).join(', ');
                } else {
                    if (!lugar && !ciudad) {
                        lugar = e.ubicacion;
                        ciudad = e.ciudad || 'Buenos Aires';
                    } else if (!lugar) {
                        lugar = e.ubicacion;
                    } else if (!ciudad) {
                        ciudad = e.ciudad || e.ubicacion;
                    }
                }
            }

            if (!direccion) {
                direccion = lugar || e.ubicacion || 'Dirección a confirmar';
            }
            if (!ciudad) {
                ciudad = e.ciudad || 'Ciudad a confirmar';
            }
            if (!lugar) {
                lugar = e.lugar || direccion || 'Lugar a confirmar';
            }

            return {
                id: e.id,
                titulo: e.nombre || e.titulo,
                descripcion: e.descripcion,
                fecha: e.fechaEvento || e.fecha,
                fechaFin: e.fechaFin,
                ciudad,
                lugar,
                direccion,
                capacidadTotal: e.capacidadTotal || 1000,
                edadMinima: e.edadMinima,
                estado: e.estado || 'PUBLICADO',
                precioEntrada: e.precio_entrada || e.precioEntrada || 15000,
                imagenUrl: e.imagenPortada || e.imagen_portada || e.imagenUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
                artistas: e.artistas || [],
                tiposTickets: (e.tipos_tickets || e.tiposTickets || []).map((t: any) => ({
                    ...t,
                    activo: t.activo !== undefined ? t.activo : true,
                    stockDisponible: t.stockDisponible !== undefined ? t.stockDisponible : (t.stock_disponible !== undefined ? t.stock_disponible : 0),
                    stockTotal: t.stockTotal !== undefined ? t.stockTotal : (t.stock_total !== undefined ? t.stock_total : 0)
                }))
            };
        };

        if (response.data && response.data.content) {
            return {
                ...response.data,
                content: response.data.content.map(mapEvento)
            } as PaginatedResponse<Evento>;
        } else if (Array.isArray(response.data)) {
            return response.data.map(mapEvento) as Evento[];
        }
        
        return response.data;
    },

    getEventoById: async (id: number | string): Promise<Evento> => {
        const response = await api.get(`/api/eventos/${id}`);
        const e = response.data;
        let ciudad = e.ciudad;
        let lugar = e.lugar;
        let direccion = e.direccion || e.direccionEvento;

        if (e.ubicacion) {
            if (e.ubicacion.includes(',')) {
                const parts = e.ubicacion.split(',').map((s: string) => s.trim());
                if (!lugar) lugar = parts[0];
                if (!ciudad) ciudad = parts.slice(1).join(', ');
            } else {
                if (!lugar && !ciudad) {
                    lugar = e.ubicacion;
                    ciudad = e.ciudad || 'Buenos Aires';
                } else if (!lugar) {
                    lugar = e.ubicacion;
                } else if (!ciudad) {
                    ciudad = e.ciudad || e.ubicacion;
                }
            }
        }

        if (!direccion) {
            direccion = lugar || e.ubicacion || 'Dirección a confirmar';
        }
        if (!ciudad) {
            ciudad = e.ciudad || 'Ciudad a confirmar';
        }
        if (!lugar) {
            lugar = e.lugar || direccion || 'Lugar a confirmar';
        }

        return {
            id: e.id,
            titulo: e.nombre || e.titulo,
            descripcion: e.descripcion,
            fecha: e.fechaEvento || e.fecha,
            fechaFin: e.fechaFin,
            ciudad,
            lugar,
            direccion,
            capacidadTotal: e.capacidadTotal || 1000,
            edadMinima: e.edadMinima,
            estado: e.estado || 'PUBLICADO',
            precioEntrada: e.precio_entrada || e.precioEntrada || 15000,
            imagenUrl: e.imagenPortada || e.imagen_portada || e.imagenUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
            artistas: e.artistas || [],
            tiposTickets: (e.tipos_tickets || e.tiposTickets || []).map((t: any) => ({
                ...t,
                activo: t.activo !== undefined ? t.activo : true,
                stockDisponible: t.stockDisponible !== undefined ? t.stockDisponible : (t.stock_disponible !== undefined ? t.stock_disponible : 0),
                stockTotal: t.stockTotal !== undefined ? t.stockTotal : (t.stock_total !== undefined ? t.stock_total : 0)
            }))
        };
    },

    createEvento: async (eventoData: Omit<Evento, 'id' | 'artistas' | 'tiposTickets'>): Promise<Evento> => {
        const ubicacionValue = eventoData.lugar && eventoData.ciudad && eventoData.lugar !== eventoData.ciudad
            ? `${eventoData.lugar}, ${eventoData.ciudad}`
            : (eventoData.lugar || eventoData.ciudad || eventoData.direccion || '');

        const payload = {
            nombre: eventoData.titulo,
            descripcion: eventoData.descripcion,
            ubicacion: ubicacionValue,
            ciudad: eventoData.ciudad,
            lugar: eventoData.lugar,
            direccion: eventoData.direccion || eventoData.lugar,
            capacidadTotal: eventoData.capacidadTotal,
            edadMinima: eventoData.edadMinima || 18,
            fechaEvento: eventoData.fecha,
            fechaFin: eventoData.fechaFin || eventoData.fecha,
            estado: eventoData.estado || 'PUBLICADO',
            imagenPortada: eventoData.imagenUrl || "https://images.unsplash.com/photo-1540039155732-684735035726?auto=format&fit=crop&w=1200&q=80"
        };
        const response = await api.post('/api/eventos', payload);
        return response.data;
    },

    updateEvento: async (id: number | string, eventoData: Partial<Evento>): Promise<Evento> => {
        const ubicacionValue = eventoData.lugar && eventoData.ciudad && eventoData.lugar !== eventoData.ciudad
            ? `${eventoData.lugar}, ${eventoData.ciudad}`
            : (eventoData.lugar || eventoData.ciudad || eventoData.direccion || '');

        const payload = {
            nombre: eventoData.titulo,
            descripcion: eventoData.descripcion,
            ubicacion: ubicacionValue,
            ciudad: eventoData.ciudad,
            lugar: eventoData.lugar,
            direccion: eventoData.direccion || eventoData.lugar,
            capacidadTotal: eventoData.capacidadTotal,
            edadMinima: eventoData.edadMinima,
            fechaEvento: eventoData.fecha,
            fechaFin: eventoData.fechaFin || eventoData.fecha,
            estado: eventoData.estado || 'PUBLICADO',
            imagenPortada: eventoData.imagenUrl
        };
        
        const response = await api.put(`/api/eventos/${id}`, payload);
        return response.data;
    },

    deleteEvento: async (id: number | string): Promise<void> => {
        await api.delete(`/api/eventos/${id}`);
    },

    asignarArtistas: async (eventoId: number | string, artistasIds: number[]): Promise<void> => {
        await api.post(`/api/eventos/${eventoId}/artistas`, { artistasIds });
    },

    getArtistasEvento: async (eventoId: number | string): Promise<any[]> => {
        try {
            const response = await api.get(`/api/eventos/${eventoId}/artistas`);
            return response.data;
        } catch (error) {
            console.error("Error fetching artists for event", error);
            return [];
        }
    },

    getTiposEntrada: async (eventoId: number | string): Promise<TicketType[]> => {
        const response = await api.get(`/api/eventos/${eventoId}/tipos-entrada`);
        return response.data;
    },

    createTipoEntrada: async (eventoId: number | string, data: Partial<TicketType>): Promise<TicketType> => {
        const response = await api.post(`/api/eventos/${eventoId}/tipos-entrada`, data);
        return response.data;
    },
    
    updateTipoEntrada: async (eventoId: number | string, tipoId: number | string, data: Partial<TicketType>): Promise<TicketType> => {
        const response = await api.put(`/api/eventos/${eventoId}/tipos-entrada/${tipoId}`, data);
        return response.data;
    },
    
    desactivarTipoEntrada: async (eventoId: number | string, tipoId: number | string): Promise<void> => {
        await api.patch(`/api/eventos/${eventoId}/tipos-entrada/${tipoId}/desactivar`);
    }
};

export default eventoService;

