// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Cambiamos 'isAuthenticated' por 'isLogged' para que coincida con tu AuthContext
  const { isLogged, loading } = useAuth();

  if (loading) return <p>Cargando rumba...</p>; 

  // Si no está logueado, lo mandamos al login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
