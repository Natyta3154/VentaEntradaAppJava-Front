import React from 'react';
import './QuienesSomos.css';
import { ShieldCheck, Zap, Ticket, Sparkles } from 'lucide-react';
import SEO from '../../components/SEO/SEO';

const QuienesSomos = () => {
    return (
        <div className="quienes-somos-container">
            <SEO
                title="Quiénes Somos | NochePass"
                description="Conocé la historia y visión de NochePass, la plataforma digital de compra de entradas y gestión de eventos de la noche."
                keywords="quienes somos NochePass, venta de entradas, comprar tickets, eventos, boliches, fiestas, entradas digitales"
            />
            {/* HERO SECTION */}
            <section className="qs-hero">
                <img 
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920" 
                    alt="Experiencia de eventos NochePass" 
                    className="qs-hero-bg" 
                />
                <div className="qs-hero-content">
                    <h1>TU NOCHE, <span className="highlight">TU ENTRADA</span></h1>
                    <p>La plataforma tecnológica para descubrir, reservar y asegurar tu lugar en los mejores eventos y fiestas.</p>
                </div>
            </section>

            {/* STORY SECTION */}
            <section className="qs-story">
                <div className="container">
                    <div className="qs-grid">
                        <div className="qs-image-box">
                            <img 
                                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800" 
                                alt="Eventos y Fiestas NochePass" 
                            />
                        </div>
                        <div className="qs-text-box">
                            <h2>REVOLUCIONANDO EL <span className="highlight">TICKETING</span></h2>
                            <p>
                                <strong>NochePass</strong> nació con un propósito claro: transformar por completo la forma en que las personas compran sus entradas y acceden a sus eventos favoritos.
                            </p>
                            <p>
                                Decidimos dejar en el pasado las filas interminables, los tickets físicos extraviados y los riesgos de estafas o reventas fraudulentas. Creamos un ecosistema 100% digital, seguro y veloz, diseñado tanto para quienes aman salir como para los productores y organizadores de eventos.
                            </p>
                            <p>
                                Con nuestra tecnología de validación QR en tiempo real y pagos protegidos, aseguramos una experiencia transparente desde el primer clic hasta el momento en que ingresás al show.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className="qs-values">
                <div className="container">
                    <h2 className="section-title-alt">NUESTROS <span>PILARES</span></h2>
                    <p className="section-subtitle">SEGURIDAD, VELOCIDAD Y EXPERIENCIA EN CADA ACCESO</p>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <ShieldCheck size={30} />
                            </div>
                            <h3>Seguridad y Confianza</h3>
                            <p>Entradas 100% oficiales y nominales con tecnología anticopia y validación QR instantánea en puerta.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Zap size={30} />
                            </div>
                            <h3>Compra Instantánea</h3>
                            <p>Proceso de compra en menos de un minuto con múltiples métodos de pago integrados y confirmación al instante.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Ticket size={30} />
                            </div>
                            <h3>Tickets Siempre Contigo</h3>
                            <p>Tus entradas disponibles en tu perfil y descargables en tu celular, listas para ingresar sin necesidad de imprimir.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Sparkles size={30} />
                            </div>
                            <h3>Eventos Exclusivos</h3>
                            <p>Cartelera curada con las mejores fiestas, festivales, boliches y preventas VIP con beneficios especiales.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="qs-team">
                <div className="container">
                    <h2 className="section-title-alt">EL <span>EQUIPO</span></h2>
                    <p className="section-subtitle">QUIENES HACEN POSIBLE TU MEJOR NOCHE</p>
                    
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400" alt="Directora de Operaciones" />
                            </div>
                            <h4>Camila Fontana</h4>
                            <span>Directora de Operaciones</span>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" alt="Co-Fundador y CEO" />
                            </div>
                            <h4>Lucas Moretti</h4>
                            <span>Co-Fundador & CEO</span>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" alt="Líder de Tecnología" />
                            </div>
                            <h4>Martín Benítez</h4>
                            <span>Líder de Tecnología & Seguridad</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default QuienesSomos;
