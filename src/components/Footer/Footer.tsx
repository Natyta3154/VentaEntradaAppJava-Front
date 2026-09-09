import React from 'react';
import './Footer.css';
import { Facebook, Instagram, Twitter, Music2, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                {/* Branding & Socials */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Music2 className="logo-icon" />
                        <h2>SALS<span>APP</span></h2>
                    </div>
                    <p className="footer-desc">
                        La noche, el ritmo y la pasión se encuentran en un solo lugar. Conectamos a los mejores bailadores con los eventos más vibrantes del mundo.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-links">
                    <h3>EXPLORAR</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/eventos">Cartelera</Link></li>
                        <li><Link to="/galeria">Experiencias</Link></li>
                        <li><Link to="/tickets">Mis Tickets</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div className="footer-links">
                    <h3>CATEGORÍAS</h3>
                    <ul>
                        <li><a href="#">Conciertos</a></li>
                        <li><a href="#">Talleres</a></li>
                        <li><a href="#">Sociales</a></li>
                        <li><a href="#">Artistas</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-contact">
                    <h3>CONTACTO CLUB</h3>
                    <ul>
                        <li><MapPin size={18} className="contact-icon" /> Calle del Son 123, Madrid</li>
                        <li><Phone size={18} className="contact-icon" /> +34 900 800 700</li>
                        <li><Mail size={18} className="contact-icon" /> preventa@salsapp.club</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="bottom-content">
                    <p>&copy; {new Date().getFullYear()} SalsApp Club. Todos los derechos reservados.</p>
                    <div className="legal-links">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
