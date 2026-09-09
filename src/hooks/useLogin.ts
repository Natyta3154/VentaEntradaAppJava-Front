import { useState } from "react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth(); //nuestra función global para loguear emisora de radio
    const navigate = useNavigate();

    const ejecutarLogin = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

     try {
        const response = await api.post('api/auth/login', { 
            email: email, 
            password: password
         });

         //Si la respuesta es exitosa
         login (response.data); //actualizamos el contexto global

         // Redirigimos dependiendo del rol
         if (response.data.rol === 'ROLE_ADMIN') {
             navigate('/admin');
         } else {
             navigate('/');
         }

    }catch (err: any) {
        //capturamos el error
        const mensajeError = err.response?.data?.detail || 'Error de login. Revisa tus credenciales.';
        setError(mensajeError);
    } finally {
        setLoading(false);
    }
    }; 
    return { ejecutarLogin, loading, error };
}
