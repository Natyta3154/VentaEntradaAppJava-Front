import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface StaffRouteProps {
    children: React.ReactNode;
}

const StaffRoute: React.FC<StaffRouteProps> = ({ children }) => {
    const { user, isLogged, loading } = useAuth();

    if (loading) return null; // O un spinner

    // Solo permitimos el acceso
    const infoUser = user;
    const isStaff = isLogged && 
        (infoUser?.rol === 'ADMIN' || (infoUser?.rol as any) === 'ROLE_ADMIN' || infoUser?.rol === 'PORTERO' || (infoUser?.rol as any) === 'ROLE_PORTERO');

    if (!isStaff) {
        console.warn("Acceso denegado: Se requiere rango de STAFF.");
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default StaffRoute;
