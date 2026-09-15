import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import StaffRoute from './components/StaffRoute';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home/Home'));
const Tickets = lazy(() => import('./pages/Tickets/Tickets'));
const Login = lazy(() => import('./pages/Login/Login'));
const Registro = lazy(() => import('./pages/Register/Register'));
const Perfil = lazy(() => import('./pages/Perfil/Perfil'));
const Galeria = lazy(() => import('./pages/Galeria/Galeria'));
const Scanner = lazy(() => import('./pages/Admin/Scanner/Scanner'));
const QuienesSomos = lazy(() => import('./pages/QuienesSomos/QuienesSomos'));
const Contacto = lazy(() => import('./pages/Contacto/Contacto'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/Admin/Layout/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'));
const EventosList = lazy(() => import('./pages/Admin/Eventos/EventosList'));
const UsuariosList = lazy(() => import('./pages/Admin/Usuarios/UsuariosList'));
const VentasList = lazy(() => import('./pages/Admin/Ventas/VentasList'));
const ArtistasList = lazy(() => import('./pages/Admin/Artistas/ArtistasList'));
const GaleriaList = lazy(() => import('./pages/Admin/Galeria/GaleriaList'));
const ContactosList = lazy(() => import('./pages/Admin/Contactos/ContactosList'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));

// Simple Loading Component
const PageLoading = () => (
  <div style={{
    height: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '20px',
    background: 'var(--bg-main)'
  }}>
    <div className="spinner" style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255, 71, 87, 0.1)',
      borderTopColor: 'var(--primary-color)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <div style={{ minHeight: '80vh' }}>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {/* --- RUTAS PÚBLICAS Y PROTEGIDAS (Con Navbar y Footer públicos) --- */}
              <Route path="/" element={<><Navbar /><div style={{ paddingTop: '80px' }}><Home /></div><Footer /></>} />
              <Route path="/login" element={<><Navbar /><div style={{ paddingTop: '80px' }}><Login /></div><Footer /></>} />
              <Route path="/registro" element={<><Navbar /><div style={{ paddingTop: '80px' }}><Registro /></div><Footer /></>} />
              <Route path="/galeria" element={<><Navbar /><div style={{ paddingTop: '80px' }}><Galeria /></div><Footer /></>} />
              <Route path="/quienes-somos" element={<><Navbar /><div style={{ paddingTop: '80px' }}><QuienesSomos /></div><Footer /></>} />
              <Route path="/contacto" element={<><Navbar /><div style={{ paddingTop: '80px' }}><Contacto /></div><Footer /></>} />

              {/* Rutas Privadas */}
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div style={{ paddingTop: '80px' }}>
                      <Tickets />
                    </div>
                    <Footer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div style={{ paddingTop: '80px' }}>
                      <Perfil />
                    </div>
                    <Footer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/scanner"
                element={
                  <StaffRoute>
                    <Navbar />
                    <div style={{ paddingTop: '80px' }}>
                      <Scanner />
                    </div>
                    <Footer />
                  </StaffRoute>
                }
              />

              {/* --- RUTAS DE ADMINISTRACIÓN (Con su propio Layout, sin Navbar/Footer públicos) --- */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                {/* Redirigir /admin a /admin/dashboard - lo haremos en el Outlet o con una route anidada index */}
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="eventos" element={<EventosList />} />
                <Route path="artistas" element={<ArtistasList />} />
                <Route path="usuarios" element={<UsuariosList />} />
                <Route path="ventas" element={<VentasList />} />
                <Route path="galeria" element={<GaleriaList />} />
                <Route path="contactos" element={<ContactosList />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
