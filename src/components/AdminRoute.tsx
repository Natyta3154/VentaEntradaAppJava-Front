import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isLogged, loading } = useAuth();

    if (loading) return null;

    const infoUser = user;
    const hasPermission = isLogged && (infoUser?.rol === 'ADMIN' || (infoUser?.rol as any) === 'ROLE_ADMIN');

    if (!hasPermission) {
        console.warn("Acceso denegado: Se requiere rango de ADMIN.");
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
