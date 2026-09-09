import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import { useLogin } from "../../hooks/useLogin.js";

import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { ejecutarLogin, loading, error } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        ejecutarLogin(username.trim(), password.trim());
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <header className="auth-header">
                    <div className="auth-icon-wrapper">
                        <User size={32} />
                    </div>
                    <h2>¡BIENVENIDO! 🕺</h2>
                    <p>Inicia sesión para vivir la mejor experiencia de salsa.</p>
                </header>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-box">
                            <p className="error-msg">{typeof error === 'string' ? error : 'Credenciales inválidas'}</p>
                        </div>
                    )}

                    <div className="input-field">
                        <User className="field-icon" size={20} />
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tu nombre de usuario"
                            required
                        />
                    </div>

                    <div className="input-field">
                        <Lock className="field-icon" size={20} />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña segura"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth-primary" disabled={loading}>
                        {loading ? "CONECTANDO..." : "ENTRAR A LA RUMBA"}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <p className="auth-footer">
                        ¿Sos nuevo por acá? <Link to="/registro">Crea tu cuenta gratis</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
