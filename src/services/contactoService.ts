import api from '../api/api';

export interface MensajeContacto {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
}

export interface MensajeContactoAdmin extends MensajeContacto {
    id: number;
    fechaEnvio: string;
    leido: boolean;
}

export const contactoService = {
    enviarMensaje: async (mensaje: MensajeContacto): Promise<void> => {
        await api.post('/api/contactos', mensaje);
    },
    obtenerContactosAdmin: async (): Promise<MensajeContactoAdmin[]> => {
        const response = await api.get('/api/contactos');
        return response.data;
    },
    marcarContactoComoLeido: async (id: number): Promise<void> => {
        await api.put(`/api/contactos/${id}/leido`);
    },
    responderMensajeContacto: async (id: number, respuesta: string): Promise<void> => {
        await api.post(`/api/contactos/${id}/responder`, { respuesta });
    }
};
