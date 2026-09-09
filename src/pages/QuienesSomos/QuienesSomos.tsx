import React from 'react';
import './QuienesSomos.css';
import { Users, Heart, Music, Award } from 'lucide-react';

const QuienesSomos = () => {
    return (
        <div className="quienes-somos-container">
            {/* HERO SECTION */}
            <section className="qs-hero">
                <img 
                    src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1920" 
                    alt="Salsa Community" 
                    className="qs-hero-bg" 
                />
                <div className="qs-hero-content">
                    <h1>Nuestra <span className="highlight">Pasión</span></h1>
                    <p>Más que un club, una familia unida por el ritmo de la salsa.</p>
                </div>
            </section>

            {/* STORY SECTION */}
            <section className="qs-story">
                <div className="container">
                    <div className="qs-grid">
                        <div className="qs-image-box">
                            <img 
                                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800" 
                                alt="Founders" 
                            />
                        </div>
                        <div className="qs-text-box">
                            <h2>Nuestra <span className="highlight">Historia</span></h2>
                            <p>
                                Todo comenzó con un sueño en el corazón de la ciudad: crear un espacio 
                                donde la autenticidad y el sabor de la salsa pudieran florecer sin límites.
                            </p>
                            <p>
                                Desde nuestras primeras noches en locales pequeños hasta convertirnos en 
                                el referente de la escena salsera, nuestra misión ha sido siempre la misma: 
                                elevar la experiencia del baile y conectar a las personas a través de la música.
                            </p>
                            <p>
                                Hoy, somos un punto de encuentro para talentos nacionales e internacionales, 
                                donde cada paso cuenta una historia y cada noche es una celebración de la vida.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className="qs-values">
                <div className="container">
                    <h2 className="section-title-alt">NUESTROS <span>VALORES</span></h2>
                    <p className="section-subtitle">LO QUE NOS IMPULSA CADA NOCHE</p>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <Users size={30} />
                            </div>
                            <h3>Comunidad</h3>
                            <p>Fomentamos un ambiente inclusivo donde todos son bienvenidos, desde principiantes hasta expertos.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Heart size={30} />
                            </div>
                            <h3>Pasión</h3>
                            <p>Ponemos el corazón en cada detalle, desde la selección musical hasta la atención en nuestra barra.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Music size={30} />
                            </div>
                            <h3>Excelencia</h3>
                            <p>Trabajamos con los mejores DJs y artistas para garantizar noches inolvidables de alta calidad.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <Award size={30} />
                            </div>
                            <h3>Tradición</h3>
                            <p>Respetamos las raíces de la salsa mientras innovamos para mantener vivo el género.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="qs-team">
                <div className="container">
                    <h2 className="section-title-alt">EL <span>EQUIPO</span></h2>
                    <p className="section-subtitle">LAS MENTES DETRÁS DEL RITMO</p>
                    
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" alt="Founding Director" />
                            </div>
                            <h4>Carlos Rivera</h4>
                            <span>Director Fundador</span>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400" alt="Lead Instructor" />
                            </div>
                            <h4>Elena Méndez</h4>
                            <span>Directora de Arte</span>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" alt="Event Manager" />
                            </div>
                            <h4>Miguel Soto</h4>
                            <span>Event Manager</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default QuienesSomos;
