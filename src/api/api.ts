import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ventaentradaappjava-back.onrender.com', 
    timeout: 10000, 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor de request para CSRF si es necesario
api.interceptors.request.use((config) => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    const csrfToken = match && match[1] ? decodeURIComponent(match[1]) : null;
    
    if (csrfToken && config.headers) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor de response para manejo de errores global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 401:
                    // No mostramos el toast si el error viene de la verificación de sesión inicial
                    if (error.config?.url !== 'api/auth/refresh') {
                        toast.error('Tu sesión ha expirado o no estás autorizado. Por favor inicia sesión nuevamente.');
                    }
                    break;
                case 403:
                    toast.error('No tienes permisos para realizar esta acción.');
                    break;
                case 404:
                    toast.error('El recurso solicitado no fue encontrado.');
                    break;
                case 500:
                    toast.error('Ocurrió un error en el servidor. Inténtalo más tarde.');
                    break;
                default:
                    // Otros errores (400, etc) pueden ser manejados específicamente en los componentes
                    break;
            }
        } else if (error.request) {
            toast.error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
            toast.error('Ocurrió un error inesperado.');
        }
        return Promise.reject(error);
    }
);

export default api;
