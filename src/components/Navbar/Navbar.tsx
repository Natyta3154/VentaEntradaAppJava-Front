import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, LogIn, LogOut, IdCard, ChevronDown, Settings, ScanQrCode, Menu, X } from 'lucide-react';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isLogged } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Extraemos info del usuario de forma segura
  const infoUser = user;

  // VERIFICACIÓN DE ACCESO: ¿Tiene permiso para escanear tickets?
  const puedoEscanear = infoUser?.rol === 'ADMIN' || (infoUser?.rol as any) === 'ROLE_ADMIN' || infoUser?.rol === 'PORTERO' || (infoUser?.rol as any) === 'ROLE_PORTERO';
  const esAdmin = infoUser?.rol === 'ADMIN' || (infoUser?.rol as any) === 'ROLE_ADMIN';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`navbar ${menuOpen ? 'menu-is-open' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <Ticket className="logo-icon" size={28} />
          <span>PARTY <span className="logo-white">CLUB & LATINEVENTS</span></span>
        </Link>

        {/* HAMBURGER BUTTON */}
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {/* MOBILE USER PREVIEW (Only visible on mobile) */}
          {isLogged && (
            <div className="mobile-user-info mobile-only">
              <div className="avatar-circle">
                {infoUser?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="user-name">{infoUser?.email}</span>
            </div>
          )}

          <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/galeria" className="nav-item" onClick={() => setMenuOpen(false)}>Galería</Link>
          <Link to="/tickets" className="nav-item" onClick={() => setMenuOpen(false)}>Tickets</Link>
          <Link to="/quienes-somos" className="nav-item" onClick={() => setMenuOpen(false)}>Quiénes Somos</Link>

          {/* MOBILE-ONLY ACTIONS */}
          {menuOpen && isLogged && (
            <div className="mobile-auth-actions">
              <Link to="/perfil" className="nav-item mobile" onClick={() => setMenuOpen(false)}>Mi Perfil</Link>
              {puedoEscanear && (
                <Link to="/staff/scanner" className="nav-item mobile" onClick={() => setMenuOpen(false)}>Validar Entradas</Link>
              )}
              {esAdmin && (
                <Link to="/admin" className="nav-item mobile" onClick={() => setMenuOpen(false)} style={{ color: '#ff4d4d', fontWeight: 'bold'  }} target="_blank" rel="noopener noreferrer">Panel Admin</Link >
              )}
              <button onClick={handleLogout} className="nav-item mobile logout">Cerrar Sesión</button>
            </div>
          )}

          {!isLogged && menuOpen && (
            <Link to="/login" className="nav-item mobile login-btn" onClick={() => setMenuOpen(false)}>Entrar</Link>
          )}
        </div>

        <div className="nav-auth desktop-only">
          {isLogged ? (
            <div className="user-dropdown-container">
              <div className="user-profile-trigger">
                <div className="avatar-circle">
                  {infoUser?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="user-name">{infoUser?.email}</span>
                <ChevronDown size={16} className="chevron-icon" />
              </div>

              <div className="dropdown-menu">
                {/* OPCIÓN DE SCANNER: Para personal autorizado */}
                {puedoEscanear && (
                  <Link to="/staff/scanner" className="dropdown-item staff-link">
                    <ScanQrCode size={18} />
                    <span>Validar Entradas</span>
                  </Link>
                )}

                {/* OPCIÓN DE ADMIN: Solo visible para staff o superuser */}
                {esAdmin && (
                  <>

                    <Link
                      to="/admin"
                      className="dropdown-item admin-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Settings size={18} />
                      <span>Panel Admin</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                  </>
                )}

                <Link to="/perfil" className="dropdown-item">
                  <IdCard size={18} />
                  <span>Mi Perfil</span>
                </Link>

                <div className="dropdown-divider"></div>

                <button onClick={handleLogout} className="dropdown-item logout-action">
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-btn-login">
              <LogIn size={18} />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
