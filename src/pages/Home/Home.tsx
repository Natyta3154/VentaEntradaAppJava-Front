import React, { useRef, useMemo } from 'react';
import './Home.css';
import { useEventos } from '../../hooks/useEventos';
import { useArtistas } from '../../hooks/useArtistas';
import { useGaleria } from '../../hooks/useGaleria';
import { useNavigate } from 'react-router-dom';
import { Images } from 'lucide-react';

// UI Components
import Button from '../../components/UI/Button/Button';
import Skeleton from '../../components/UI/Skeleton/Skeleton';

// Global Components
import EventCard, { EventCardSkeleton } from '../../components/Cards/EventCard/EventCard';
import DjCard, { DjCardSkeleton } from '../../components/Cards/DjCard/DjCard';
import GalleryItem, { GallerySkeleton } from '../../components/Cards/GalleryItem/GalleryItem';
import Modal from '../../components/UI/Modal/Modal';
import TicketTierCard from '../../components/Cards/TicketTierCard/TicketTierCard';
import api from '../../api/api';
import { eventoService } from '../../services/eventoService';
import SEO from '../../components/SEO/SEO';
import { safeRedirectToCheckout } from '../../utils/security';
import { Artista, Evento } from '../../types';
// --- COMPONENTE PRINCIPAL ---

const Home = () => {
    const { eventos, loading } = useEventos();
    const { artistas, loading: loadingArtistas } = useArtistas();
    const { media, loading: loadingMedia } = useGaleria(6);
    const navigate = useNavigate();

    // Modal states
    const [isTicketModalOpen, setIsTicketModalOpen] = React.useState(false);
    const [selectedEvento, setSelectedEvento] = React.useState<Evento | null>(null);
    const [processingId, setProcessingId] = React.useState<number | null>(null);
    const [nextEventoArtistas, setNextEventoArtistas] = React.useState<Artista[]>([]);

    // useRef for professional scrolling
    const eventosRef = useRef<HTMLDivElement>(null);

    const scrollToEventos = () => {
        eventosRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleOpenTickets = (evento: Evento) => {
        setSelectedEvento(evento);
        setIsTicketModalOpen(true);
    };

    const handleBuyTicket = async (eventoId: number, tipoId: number, cantidad: number) => {
        try {
            setProcessingId(tipoId);
            const response = await api.post('api/ventas/comprar', {
                items: [
                    {
                        tipoEntradaId: tipoId,
                        cantidad: cantidad
                    }
                ]
            });

            // Mercado Pago: Usar URL provista de forma validada y segura
            const checkoutUrl = response.data.sandbox_init_point 
                || response.data.sandboxInitPoint 
                || response.data.checkoutUrl 
                || response.data.init_point;

            const redirected = safeRedirectToCheckout(checkoutUrl);
            if (!redirected) {
                alert("No se pudo iniciar el proceso de pago seguro. Verifica la configuración.");
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                alert("Debes iniciar sesión para comprar tickets.");
                navigate('/login');
            } else {
                alert("Ocurrió un error al procesar la compra. Inténtalo de nuevo.");
            }
        } finally {
            setProcessingId(null);
        }
    };

    const nextEvento = eventos.length > 0 ? eventos[0] : null;

    React.useEffect(() => {
        const fetchArtistas = async () => {
            if (nextEvento && nextEvento.id) {
                try {
                    const arts = await eventoService.getArtistasEvento(nextEvento.id);
                    setNextEventoArtistas(arts);
                } catch (error) {
                    console.error("Error fetching artists for next event", error);
                }
            }
        };
        fetchArtistas();
    }, [nextEvento]);

    // Memoized arrays for skeletons to avoid unnecessary re-renders
    const skeletonArrays = useMemo(() => ({
        events: Array(3).fill(0),
        djs: Array(3).fill(0),
        gallery: Array(6).fill(0)
    }), []);

    // Schema.org Structured Data for Rich Snippets
    const schemaData = useMemo(() => {
        if (!nextEvento) return null;
        return {
            '@context': 'https://schema.org',
            '@type': 'DanceEvent',
            name: nextEvento.titulo,
            startDate: nextEvento.fecha,
            description: nextEvento.descripcion || 'Conéctate con la esencia del baile en los eventos más exclusivos de salsa.',
            image: nextEvento.imagenUrl || '/img/photo-hero.webp',
            location: {
                '@type': 'Place',
                name: nextEvento.lugar,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: nextEvento.ciudad
                }
            },
            organizer: {
                '@type': 'Organization',
                name: 'NochePass',
                url: 'https://nochepass.com'
            }
        };
    }, [nextEvento]);

    return (
        <div className="home-container">
            <SEO
                title="Tu Noche, Tu Entrada"
                description="Descubrí los mejores eventos, comprá tu entrada y disfrutá una noche inolvidable con NochePass."
                schemaData={schemaData}
            />
            {/* HERO SECTION */}
            <section className="hero">
                <img
                    src="/img/photo-hero.webp"
                    alt="Salsa"
                    className="hero-bg"
                    fetchPriority="high"
                    width="1920"
                    height="1080"
                />

                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <span className="hero-tagline">LA EXPERIENCIA DEFINITIVA</span>
                    <h1>
                        Tu Noche, <br />
                        <span className="highlight">Tu Entrada</span>
                    </h1>
                    <p>Descubrí los mejores eventos, comprá tu entrada y disfrutá una noche inolvidable.</p>


                    <div className="hero-actions">
                        <Button variant="primary" onClick={scrollToEventos}>
                            Explorar Cartelera
                        </Button>

                        <Button variant="outline" onClick={() => navigate('/galeria')}>
                            Ver Experiencias
                        </Button>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 1: CIRCLE FEATURES */}
            <section className="circle-features">
                <div className="container">
                    <div className="feature-item">
                        <div className="circle-frame">
                            <img src="https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=400" alt="Clases de Salsa" loading="lazy" />
                        </div>
                        <h3>APRENDE A <br /><span>BAILAR</span></h3>
                        <p>Clases personalizadas para todos los niveles con instructores expertos.</p>
                    </div>

                    <div className="feature-item">
                        <div className="circle-frame">
                            <img src="https://images.unsplash.com/photo-1524117074681-31bd4bb22ad3?q=80&w=400" alt="Shows en vivo" loading="lazy" />
                        </div>
                        <h3>SHOWS EN <br /><span>VIVO</span></h3>
                        <p>Increíbles coreografías de bailarinas profesionales cada noche.</p>
                    </div>

                    <div className="feature-item">
                        <div className="circle-frame">
                            <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400" alt="Los mejores DJs" loading="lazy" />
                        </div>
                        <h3>ARTISTAS <br /><span>EN VIVO</span></h3>
                        <p>La mejor selección musical a cargo de los artistas referentes del género.</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: UPCOMING EVENT */}
            <section className="featured-event">
                <div className="container">
                    <h2 className="section-title-alt">PRÓXIMO <span>EVENTO</span></h2>
                    <p className="section-subtitle text-white-400">LA CITA OBLIGADA PARA LOS SALSEROS</p>

                    {loading ? (
                        <div className="event-flex skeleton-featured" style={{ minHeight: '400px' }}>
                            <div className="event-image-main">
                                <Skeleton height={400} width="100%" borderRadius="4px" />
                            </div>
                            <div className="event-details-main">
                                <Skeleton height={50} width="80%" className="mb-4" />
                                <Skeleton height={80} width="100%" className="mb-4" />
                                <Skeleton height={20} width="60%" className="mb-2" />
                                <Skeleton height={20} width="50%" className="mb-4" />
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <Skeleton height={50} width="150px" />
                                    <Skeleton height={50} width="150px" />
                                </div>
                            </div>
                        </div>
                    ) : nextEvento ? (
                        <div className="event-flex">
                            <div className="event-image-main">
                                <img
                                    src={nextEvento.imagenUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800"}
                                    alt={nextEvento.titulo}
                                    loading="lazy"
                                    width="800"
                                    height="600"
                                />
                                <div className="event-badge">
                                    {new Date(nextEvento.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                                </div>
                            </div>

                            <div className="event-details-main">
                                <span className="event-location-tag text-white">{nextEvento.ciudad} • {nextEvento.lugar}</span>
                                <h3 className="text-white">{nextEvento.titulo.split(' ').slice(0, 3).join(' ')} <br /><span className="text-white">{nextEvento.titulo.split(' ').slice(3).join(' ')}</span></h3>
                                <p>{nextEvento.descripcion || "Prepárate para una experiencia inmersiva. Esta noche no es solo baile; es un despliegue de talento con orquesta en vivo y lo mejor de la salsa."}</p>

                                <ul className="event-highlights text-white">
                                    <li>✨ <strong>Artistas:</strong> {nextEventoArtistas && nextEventoArtistas.length > 0 ? nextEventoArtistas.map(a => a.nombre).join(', ') : 'DJs Invitados'}</li>
                                    <li>🎧 <strong>Ambiente:</strong> Los mejores vinilos de salsa clásica.</li>
                                    <li>🍹 <strong>Barra:</strong> Coctelería temática toda la noche.</li>
                                </ul>

                                <div className="event-actions">
                                    <Button variant="accent" onClick={() => handleOpenTickets(nextEvento)}>
                                        COMPRAR TICKETS
                                    </Button>
                                    <Button variant="outline" onClick={() => navigate('/contacto')}>
                                        RESERVAR MESA VIP
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-featured-event">
                            <p>No hay eventos próximos programados. ¡Vuelve pronto!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* SECCIÓN 3: DJS PROFILES */}
            <section className="djs-section">
                <div className="container">
                    <h2 className="section-title-alt">PERFILES DE <span>ARTISTAS</span></h2>
                    <p className="section-subtitle">CONOCE A LOS MAESTROS DEL ESCENARIO</p>
                    <div className="djs-grid">
                        {loadingArtistas ? (
                            skeletonArrays.djs.map((_, i) => <DjCardSkeleton key={i} />)
                        ) : artistas.length > 0 ? (
                            artistas.map((artista: any) => <DjCard key={artista.id} dj={artista} />)
                        ) : (
                            <div className="no-data">
                                <p>No hay artistas programados actualmente.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* SECCIÓN 4: GALERÍA DINÁMICA */}
            <section className="gallery-preview">
                <div className="container">
                    <h2 className="section-title-alt">MOMENTOS <span>DEL CLUB</span></h2>
                    <p className="section-subtitle">VIVE LA EXPERIENCIA ANTES DE VIVIRLA</p>

                    <div className="modern-gallery-grid">
                        {loadingMedia ? (
                            skeletonArrays.gallery.map((_, i) => (
                                <GallerySkeleton key={i} isLarge={i === 0} isWide={i === 3} />
                            ))
                        ) : media.length > 0 ? (
                            media.map((item, index) => (
                                <GalleryItem
                                    key={item.id}
                                    item={item}
                                    isLarge={index === 0}
                                    isWide={index === 3}
                                    onClick={() => navigate('/galeria')}
                                />
                            ))
                        ) : (
                            <div className="no-data">
                                <p>Capturando la esencia... pronto verás fotos aquí.</p>
                            </div>
                        )}
                    </div>

                    <div className="gallery-cta">
                        <Button variant="gallery" onClick={() => navigate('/galeria')}>
                            <Images size={20} /> Ver Galería Completa
                        </Button>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 5: EVENTOS */}
            <section className="events-section" id="eventos" ref={eventosRef}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">CARTELERA DE <span className="highlight">TICKETS</span></h2>
                        <p className="section-subtitle">ASEGURA TU LUGAR EN NUESTROS PRÓXIMOS CONCEPTOS</p>
                    </div>

                    <div className="events-grid">
                        {loading ? (
                            skeletonArrays.events.map((_, i) => <EventCardSkeleton key={i} />)
                        ) : eventos.length > 0 ? (
                            eventos.map((evento) => (
                                <EventCard
                                    key={evento.id}
                                    evento={evento}
                                    onBuy={handleOpenTickets}
                                />
                            ))
                        ) : (
                            <div className="no-events">
                                <p>El escenario está descansando. Pronto habrá nuevas fechas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* TICKET SELECTION MODAL */}
            <Modal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                title="Selecciona tu Entrada"
            >
                {selectedEvento && (
                    <div className="modal-tickets-container">
                        <div className="modal-event-info">
                            <p>{selectedEvento.ciudad} • {selectedEvento.lugar}</p>
                            <h3>{selectedEvento.titulo}</h3>
                        </div>

                        <div className="tiers-grid mini">
                            {selectedEvento.tiposTickets && selectedEvento.tiposTickets.length > 0 ? (() => {
                                const sortedTiers = [...selectedEvento.tiposTickets].sort((a, b) => (a.precio || 0) - (b.precio || 0));
                                const activeTierId = sortedTiers.find(t => t.stockDisponible > 0)?.id;

                                return sortedTiers.map(tier => (
                                    <TicketTierCard
                                        key={tier.id}
                                        tier={tier}
                                        isActive={tier.id === activeTierId}
                                        isProcessing={processingId === tier.id}
                                        onBuy={(tierId, quantity) => handleBuyTicket(selectedEvento.id, tierId, quantity)}
                                    />
                                ));
                            })() : (
                                <div className="no-tiers">
                                    <p>No hay tickets disponibles para este evento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Home;
