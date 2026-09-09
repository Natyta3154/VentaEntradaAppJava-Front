import api from '../api/api';
import { PaginatedResponse } from '../types';

export interface AdminCompra {
    id: number;
    usuarioEmail: string;
    usuarioNombre: string;
    total: number;
    estado: string;
    fechaCompra: string;
    mercadoPagoId: string;
}

export interface AdminEntrada {
    id: number;
    eventoNombre: string;
    tipoEntradaNombre: string;
    estado: string;
    usuarioEmail: string;
    usuarioNombre: string;
    compraId: number;
}

export const adminVentasService = {
    getCompras: async (page = 0, size = 50): Promise<PaginatedResponse<AdminCompra> | AdminCompra[]> => {
        const response = await api.get('/api/admin/ventas', {
            params: { page, size }
        });
        return response.data;
    },

    getEntradas: async (page = 0, size = 50): Promise<PaginatedResponse<AdminEntrada> | AdminEntrada[]> => {
        const response = await api.get('/api/admin/ventas/entradas', {
            params: { page, size }
        });
        return response.data;
    },

    procesarDevolucion: async (compraId: number): Promise<void> => {
        await api.post(`/api/admin/ventas/${compraId}/devolucion`);
    },

    eliminarCompra: async (compraId: number): Promise<void> => {
        await api.delete(`/api/admin/ventas/${compraId}`);
    }
};

export default adminVentasService;
