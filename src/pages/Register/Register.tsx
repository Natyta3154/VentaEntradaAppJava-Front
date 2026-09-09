import React, { useState } from "react";
import { useRegistro } from "../../hooks/useRegistro.js";
import { useNavigate, Link } from "react-router-dom";
import './Registro.css';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const Registro = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: ''
    });

    const { registrarUsuario, loading, error } = useRegistro();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const res = await registrarUsuario({
            username: formData.username.trim(),
            email: formData.email.trim(),
            nombre: formData.first_name.trim(),
            apellido: formData.last_name.trim(),
            password: formData.password 
        });

        if (res.success) {
            alert("¡Registro exitoso! 💃");
            navigate('/login');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card registro">
                <header className="auth-header">
                    <div className="auth-icon-wrapper">
                        <UserPlus size={32} />
                    </div>
                    <h2>ÚNETE A LA RUMBA 💃</h2>
                    <p>Crea tu cuenta para comprar tus entradas.</p>
                </header>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-box">
                            {typeof error === 'string' ? (
                                <p className="error-msg">{error}</p>
                            ) : (
                                Object.entries(error).map(([field, messages]) => (
                                    <p key={field} className="error-msg">
                                        <strong>{field}:</strong> {Array.isArray(messages) ? messages[0] : messages}
                                    </p>
                                ))
                            )}
                        </div>
                    )}

                    <div className="input-field">
                        <User className="field-icon" size={20} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <Mail className="field-icon" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="name-row">
                        <div className="input-field">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Nombre"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-field">
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Apellido"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <Lock className="field-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <div className="input-field">
                        <Lock className="field-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Repetir contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth-primary" disabled={loading}>
                        {loading ? 'CREANDO CUENTA...' : 'REGISTRARME'}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <p className="auth-footer">
                        ¿Ya sos de los nuestros? <Link to="/login">Inicia sesión aquí</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Registro;
