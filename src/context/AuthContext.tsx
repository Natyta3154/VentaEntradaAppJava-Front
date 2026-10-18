import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { sanitizeUser } from '../utils/security';

// ==========================================
// 1. DEFINICIÓN DEL TIPO DE CONTEXTO
// Especifica qué datos y funciones estarán accesibles
// globalmente en toda la aplicación.
// ==========================================
interface AuthContextType {
    user: User | null;                      // Datos del usuario logueado o null si no hay sesión
    login: (userData: any) => void;         // Función para guardar el usuario tras iniciar sesión
    logout: () => Promise<void>;            // Función para cerrar la sesión actual
    isLogged: boolean;                      // Booleano rápido para saber si está autenticado (true/false)
    loading: boolean;                       // Booleano que indica si se está comprobando la sesión
    verificarSesion?: () => Promise<void>;  // Función para re-verificar y actualizar los datos del usuario
}

// Crea el contexto de autenticación de React con valor inicial undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// 2. PROVEEDOR DE AUTENTICACIÓN (AuthProvider)
// Envuelve los componentes hijos para suministrarles el estado de la sesión
// ==========================================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Estado que guarda la información del usuario autenticado
    const [user, setUser] = useState<User | null>(null);
    // Estado que controla la pantalla de carga inicial al abrir o recargar la app
    const [loading, setLoading] = useState(true);

    /**
     * Comprueba si el usuario tiene una sesión activa previa:
     * 1. Revisa si existe la bandera 'isAuthenticated' en el almacenamiento local (localStorage).
     * 2. Si existe, consulta al backend (/api/auth/me o refresh) para obtener los datos actualizados del usuario.
     * 3. Sanitiza los datos antes de persistirlos en el estado en memoria.
     * 4. Si la sesión expiró o hay error, limpia el almacenamiento y resetea el usuario a null.
     */
    const verificarSesion = async () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            const data = await authService.getUserInfo();
            const cleanUser = sanitizeUser(data);
            setUser(cleanUser); 
        } catch (error) {
            setUser(null);
            localStorage.removeItem('isAuthenticated');
        } finally {
            setLoading(false);
        }
    };

    // Ejecuta la verificación de sesión automáticamente una sola vez al cargar la app
    useEffect(() => {
        verificarSesion();
    }, []);

    /**
     * Inicia sesión en el frontend:
     * Sanitiza y guarda el usuario en el estado y marca 'isAuthenticated' en localStorage.
     */
    const login = (userData: any) => {
        const cleanUser = sanitizeUser(userData);
        setUser(cleanUser); 
        localStorage.setItem('isAuthenticated', 'true');
    };

    /**
     * Cierra la sesión:
     * 1. Llama al endpoint de logout en el backend.
     * 2. Limpia los datos del usuario en memoria y en localStorage.
     */
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Error al cerrar sesión:", error);
            }
        } finally {
            setUser(null);
            localStorage.removeItem('isAuthenticated');
        }
    };

    return (
        // Provee el estado y las funciones a todos los componentes hijos
        <AuthContext.Provider value={{ user, login, logout, isLogged: !!user, loading, verificarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

// ==========================================
// 3. HOOK PERSONALIZADO (useAuth)
// Permite a cualquier componente acceder al contexto fácilmente:
// Ejemplo de uso: const { user, isLogged, logout } = useAuth();
// ==========================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
