import { useState } from 'react';
import { authService } from '../services/authService';

export const useRegistro = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registrarUsuario = async (datos: any) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.registro(datos);
            return { success: true, data };
        } catch (err: any) {
            // El error ya viene formateado desde authService
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { registrarUsuario, loading, error };
};
