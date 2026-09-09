import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    isLogged: boolean;
    loading: boolean;
    verificarSesion?: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const verificarSesion = async () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            const data = await authService.getUserInfo();
            setUser(data); 
        } catch (error) {
            setUser(null);
            localStorage.removeItem('isAuthenticated');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verificarSesion();
    }, []);

    const login = (userData: User) => {
        setUser(userData); 
        localStorage.setItem('isAuthenticated', 'true');
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setUser(null);
            localStorage.removeItem('isAuthenticated');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLogged: !!user, loading, verificarSesion }}>
            {!loading ? children : (
                <div className="loading-screen" style={{ textAlign: 'center', padding: '100px' }}>
                    <h2>Preparando la pista... 💃🕺</h2>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
