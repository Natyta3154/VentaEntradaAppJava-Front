import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService'; // Importante importar tu servicio
import { User, Mail, Save, Edit2, X, Ticket, ScanQrCode, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Perfil.css';

const Perfil = () => {
    const { user, loading, verificarSesion } = useAuth(); // Extraemos verificarSesion para actualizar el estado global
    const [editMode, setEditMode] = useState(false);

    const infoUser = user;
    const [misTickets, setMisTickets] = useState<any[]>([]);

    // 1. Inicializamos el estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: ''
    });

    // 2. EFECTO CLAVE: Este efecto "escucha" cuando llegan los datos de la BD
    // y los pone dentro de los inputs del formulario.
    useEffect(() => {
        if (infoUser) {
            setFormData({
                nombre: infoUser.nombre || '',
                apellido: infoUser.apellido || '',
                email: infoUser.email || ''
            });
        }
    }, [infoUser]); // Se dispara cuando el usuario carga o cambia

    if (loading) return <div className="loader">Cargando...</div>;
    if (!user) return <p className="error-msg">Sesión no encontrada.</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await authService.updateUserProfile(formData);
            alert("¡Perfil actualizado en la base de datos! 💃");
            setEditMode(false);

            // 3. Actualizamos el Contexto para que el Navbar y el Perfil
            // muestren los nuevos datos sin necesidad de recargar (F5)
            if (verificarSesion) await verificarSesion();

        } catch (error) {
            console.error(error);
            alert("Error al guardar los cambios.");
        }
    };

    return (
        <div className="perfil-container">
            <header className="perfil-header">
                <h1>HOLA, <span>{infoUser?.email?.toUpperCase()}</span> 🕺</h1>
                <p>Gestiona tu cuenta y revisa tus entradas para la rumba.</p>
            </header>

            <div className="perfil-content">
                {/* --- SECCIÓN PARA STAFF / PORTEROS --- */}
                {(infoUser?.rol === 'ADMIN' || (infoUser?.rol as any) === 'ROLE_ADMIN' || infoUser?.rol === 'PORTERO' || (infoUser?.rol as any) === 'ROLE_PORTERO') && (
                    <section className="info-card staff-card">
                        <div className="card-header">
                            <div className="title-group">
                                <ShieldCheck className="icon-red" />
                                <h2>Acceso de Personal</h2>
                            </div>
                        </div>
                        <p className="staff-desc">Tienes permisos de validación. Usa el botón de abajo para escanear en la puerta.</p>
                        <Link to="/staff/scanner" className="btn-staff-action">
                            <ScanQrCode size={20} />
                            ABRIR ESCÁNER DE PUERTA
                        </Link>
                    </section>
                )}

                <section className="info-card">
                    <div className="card-header">
                        <div className="title-group">
                            <User className="icon-red" />
                            <h2>Datos Personales</h2>
                        </div>
                        <button
                            className={`btn-action ${editMode ? 'btn-cancel' : 'btn-edit'}`}
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? <><X size={18} /> Cancelar</> : <><Edit2 size={18} /> Editar</>}
                        </button>
                    </div>

                    <div className="form-grid">
                        <div className="input-group">
                            <label>Nombre</label>
                            {editMode ? (
                                <input
                                    name="nombre"
                                    value={formData.nombre} // <--- Toma el dato de la BD
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="data-text">{infoUser?.nombre || 'Sin definir'}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Apellido</label>
                            {editMode ? (
                                <input
                                    name="apellido"
                                    value={formData.apellido} // <--- Toma el dato de la BD
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="data-text">{infoUser?.apellido || 'Sin definir'}</p>
                            )}
                        </div>

                        <div className="input-group full-width">
                            <label><Mail size={14} /> Correo Electrónico</label>
                            {editMode ? (
                                <input
                                    name="email"
                                    value={formData.email} // <--- Toma el dato de la BD
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="data-text">{infoUser?.email}</p>
                            )}
                        </div>
                    </div>

                    {editMode && (
                        <button className="btn-save-changes" onClick={handleSave}>
                            <Save size={18} /> GUARDAR CAMBIOS
                        </button>
                    )}
                </section>

                {/* --- SECCIÓN DE TICKETS --- */}
                <section className="tickets-wrapper">
                    <div className="title-group">
                        <Ticket className="icon-red" />
                        <h2>Mis Entradas</h2>
                    </div>

                    {misTickets.length > 0 ? (
                        <div className="tickets-grid">
                            {misTickets.map((ticket: any) => (
                                <div className="ticket-item" key={ticket.id}>
                                    <div className="ticket-body">
                                        <h3>{ticket.evento_nombre}</h3>
                                        <p className="ticket-date">{ticket.fecha_evento}</p>
                                        <div className="qr-container">
                                            <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${ticket.codigo_qr}`} alt="QR" />
                                        </div>
                                        <span className="ticket-id">#{ticket.codigo_unico}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No tienes tickets registrados.</p>
                            <button className="btn-go-shop" onClick={() => window.location.href = '/tickets'}>
                                COMPRAR ENTRADAS
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Perfil;
