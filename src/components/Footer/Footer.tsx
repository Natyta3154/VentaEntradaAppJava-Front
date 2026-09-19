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
                        <h2>NOCHE<span>PASS</span></h2>
                    </div>
                    <p className="footer-desc">
                        Tu Noche, Tu Entrada. Descubrí y asegurá tu lugar en las mejores fiestas, boliches y eventos exclusivos.
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
                        <li><Link to="/tickets">Cartelera</Link></li>
                        <li><Link to="/galeria">Experiencias</Link></li>
                        <li><Link to="/perfil">Mis Tickets</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div className="footer-links">
                    <h3>CATEGORÍAS</h3>
                    <ul>
                        <li><a href="#">Fiestas</a></li>
                        <li><a href="#">Boliches</a></li>
                        <li><a href="#">Festivales</a></li>
                        <li><a href="#">Artistas</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-contact">
                    <h3>CONTACTO</h3>
                    <ul>
                        <li><MapPin size={18} className="contact-icon" /> Buenos Aires, Argentina</li>
                        <li><Phone size={18} className="contact-icon" /> +54 11 1234 5678</li>
                        <li><Mail size={18} className="contact-icon" /> contacto@nochepass.com</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="bottom-content">
                    <p>&copy; {new Date().getFullYear()} NochePass. Todos los derechos reservados.</p>
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
