import React, { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Music } from 'lucide-react';
import Button from '../../UI/Button/Button';
import Skeleton from '../../UI/Skeleton/Skeleton';
import './EventCard.css';

import { Evento } from '../../../services/eventoService';

interface EventCardProps {
    evento: Evento;
    onBuy?: (evento: Evento) => void;
}

const EventCard: React.FC<EventCardProps> = memo(({ evento, onBuy }) => {
    const navigate = useNavigate();

    const processedData = useMemo(() => {
        const fechaObj = new Date(evento.fecha);
        const dia = fechaObj.getDate();
        const mes = fechaObj.toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
        const hora = fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        const ticketActivo = evento.tiposTickets
            ?.filter(t => t.stockDisponible > 0)
            .sort((a, b) => a.precio - b.precio)[0];

        const esAgotado = evento.tiposTickets && evento.tiposTickets.length > 0 && !ticketActivo;
        const esUltimas = ticketActivo && ticketActivo.stockDisponible <= 10;
        const precioFinal = ticketActivo ? ticketActivo.precio : evento.precioEntrada;

        return { dia, mes, hora, ticketActivo, esAgotado, esUltimas, precioFinal };
    }, [evento]);

    const { dia, mes, hora, ticketActivo, esAgotado, esUltimas, precioFinal } = processedData;

    const handleBuyClick = () => {
        if (onBuy) {
            onBuy(evento);
        } else {
            navigate(`/tickets`);
        }
    };

    return (
        <div className={`event-card ${esAgotado ? 'sold-out' : ''}`}>
            <div className="event-image">
                <img
                    src={evento.imagenUrl || "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=500"}
                    alt={evento.titulo}
                    loading="lazy"
                    width="500"
                    height="350"
                />
                <div className="date-badge">
                    <span className="day">{dia}</span>
                    <span className="month">{mes}</span>
                </div>

                {esAgotado ? (
                    <div className="ticket-badge sold-out">AGOTADO</div>
                ) : esUltimas && ticketActivo ? (
                    <div className="ticket-badge urgency">¡ÚLTIMAS {ticketActivo.stockDisponible}!</div>
                ) : ticketActivo ? (
                    <div className="ticket-badge">ANTICIPADA</div>
                ) : null}
            </div>

            <div className="event-info">
                {evento.artistas && evento.artistas.length > 0 && (
                    <div className="event-djs-container">
                        <Music size={14} />
                        <span className="event-djs">
                            {evento.artistas.map(a => a.nombre).join(' & ')}
                        </span>
                    </div>
                )}
                <h3>{evento.titulo}</h3>
                <div className="event-details">
                    <span><MapPin size={16} /> {evento.ciudad}, {evento.lugar}</span>
                    <span><Calendar size={16} /> {hora} HS</span>
                </div>
                <div className="event-footer">
                    <div className="price-phases-list">
                        {evento.tiposTickets && evento.tiposTickets.length > 0 ? (
                            evento.tiposTickets.sort((a, b) => a.precio - b.precio).map(t => (
                                <div 
                                    key={t.id} 
                                    className={`phase-price-item ${t.stockDisponible > 0 && t.id === ticketActivo?.id ? 'active' : ''} ${t.stockDisponible === 0 ? 'exhausted' : ''}`}
                                >
                                    <span className="phase-name">{t.nombre}:</span>
                                    <span className="phase-val">${t.precio}</span>
                                </div>
                            ))
                        ) : (
                            <span className="price">
                                {esAgotado ? 'SOLD OUT' : `$${precioFinal}`}
                            </span>
                        )}
                    </div>
                    <div className="event-footer-bottom">
                        <div className="current-price-display">
                            {ticketActivo && <span className="price-tag">${ticketActivo.precio}</span>}
                        </div>
                        <Button
                            variant="buy"
                            onClick={handleBuyClick}
                            disabled={esAgotado}
                        >
                            <Ticket size={18} /> {esAgotado ? 'Agotado' : 'Comprar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export const EventCardSkeleton = () => (
    <div className="event-card skeleton-card">
        <Skeleton height={220} width="100%" />
        <div className="event-info">
            <Skeleton height={20} width="60%" className="mb-2" />
            <Skeleton height={30} width="80%" className="mb-4" />
            <div className="event-details">
                <Skeleton height={15} width="90%" className="mb-1" />
                <Skeleton height={15} width="70%" />
            </div>
            <div className="event-footer" style={{ borderTop: 'none' }}>
                <div className="event-footer-bottom">
                    <Skeleton height={40} width="40%" />
                    <Skeleton height={40} width="40%" />
                </div>
            </div>
        </div>
    </div>
);

export default EventCard;
