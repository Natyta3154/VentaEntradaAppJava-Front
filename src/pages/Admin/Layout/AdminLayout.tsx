import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Ticket, Menu, X, LogOut, ChevronLeft, Image, Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const infoUser = user;

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/eventos', icon: Calendar, label: 'Eventos' },
        { path: '/admin/artistas', icon: Users, label: 'Artistas' },
        { path: '/admin/usuarios', icon: Users, label: 'Usuarios' },
        { path: '/admin/ventas', icon: Ticket, label: 'Ventas y Entradas' },
        { path: '/admin/galeria', icon: Image, label: 'Galería' },
        { path: '/admin/contactos', icon: Mail, label: 'Contactos' }
    ];

    return (
        <div className="flex min-h-screen bg-zinc-950 text-gray-300 font-sans">
            {/* Overlay para móviles */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm md:hidden" 
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside 
                className={`fixed top-0 left-0 h-screen w-[260px] bg-zinc-900 border-r border-rose-500/20 flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-lg m-0 text-violet-500 font-bold tracking-[2px]">
                        PANEL <span className="text-white">ADMIN</span>
                    </h2>
                    <button className="md:hidden text-gray-300 bg-transparent border-none cursor-pointer" onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>

                <div className="p-5 flex items-center gap-3 border-b border-white/5">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center font-bold text-white">
                        {infoUser?.email?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span>{infoUser?.email || 'Administrador'}</span>
                </div>

                <nav className="flex-1 py-5 px-0 flex flex-col gap-1">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center gap-4 py-3 px-5 text-gray-400 no-underline transition-all duration-200 border-l-4 w-full text-left text-base
                                ${isActive ? 'text-white bg-gradient-to-r from-rose-500/20 to-transparent border-violet-500' : 'border-transparent hover:text-gray-200 hover:bg-rose-500/10'}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="py-5 border-t border-white/5">
                    <Link 
                        to="/" 
                        className="flex items-center gap-4 py-3 px-5 text-gray-400 no-underline transition-all duration-200 border-l-4 border-transparent hover:text-gray-200 hover:bg-rose-500/10"
                    >
                        <ChevronLeft size={20} />
                        <span>Volver a la Web</span>
                    </Link>
                    <button 
                        className="w-full text-left flex items-center gap-4 py-3 px-5 text-violet-500 transition-all duration-200 border-l-4 border-transparent hover:bg-rose-500/15 cursor-pointer bg-transparent border-none" 
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-h-screen md:ml-[260px] w-full">
                <header className="h-[60px] bg-zinc-950/80 backdrop-blur-md border-b border-rose-500/10 flex items-center px-5 sticky top-0 z-30">
                    <button className="md:hidden mr-4 text-gray-300 bg-transparent border-none cursor-pointer" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <div className="font-semibold text-gray-400">
                        Administración del Sistema
                    </div>
                </header>
                
                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
