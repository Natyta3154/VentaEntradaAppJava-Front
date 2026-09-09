import api from '../api/api';

export interface DashboardMetrics {
    totalRecaudado: number;
    ventasDelDia: number;
    entradasVendidas: number;
    entradasValidadas: number;
    usuariosActivos: number;
    eventosActivos: number;
    devoluciones: number;
}

export interface EventoOcupacion {
    eventoId: number;
    titulo: string;
    capacidadTotal: number;
    entradasVendidas: number;
    porcentajeOcupacion: number;
}

export interface AlertaStock {
    eventoId: number;
    eventoTitulo: string;
    tipoTicketId: number;
    tipoTicketNombre: string;
    stockDisponible: number;
}

export const dashboardService = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        const response = await api.get('/api/admin/dashboard/metrics');
        return response.data;
    },

    getOcupacionEventos: async (): Promise<EventoOcupacion[]> => {
        const response = await api.get('/api/admin/dashboard/ocupacion');
        return response.data;
    },

    getAlertasStock: async (): Promise<AlertaStock[]> => {
        const response = await api.get('/api/admin/dashboard/alertas-stock');
        return response.data;
    }
};
