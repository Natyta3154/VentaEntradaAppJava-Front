import React, { useState } from 'react';
import './Tickets.css';
import { useEventos } from '../../hooks/useEventos';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

// UI Components
import Skeleton from '../../components/UI/Skeleton/Skeleton';

// Global Components
import TicketTierCard from '../../components/Cards/TicketTierCard/TicketTierCard';
import SEO from '../../components/SEO/SEO';

const Tickets = () => {
  const navigate = useNavigate();
  const { eventos, loading, error } = useEventos();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleBuy = async (eventoId: number, tipoId: number, cantidad: number) => {
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

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("Tu sesión ha expirado. Por favor, ingresa de nuevo.");
        navigate('/login');
      } else {
        alert("Error al procesar el pago.");
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="tickets-page">
        <header className="tickets-header">
          <Skeleton height={50} width="40%" className="mb-4 mx-auto" />
          <Skeleton height={20} width="60%" className="mx-auto" />
        </header>
        <div className="event-selection-grid">
          <Skeleton height={400} width="100%" className="mb-4" />
          <Skeleton height={400} width="100%" className="mb-4" />
          <Skeleton height={400} width="100%" />
        </div>
      </div>
    );
  }

  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="tickets-page">
      <SEO
        title="Entradas"
        description="Asegurá tu lugar en las mejores fiestas y eventos exclusivos con NochePass. Comprá tus entradas oficiales de forma rápida y segura."
        keywords="entradas, tickets, fiestas, boliches, NochePass, comprar entradas"
      />
      <header className="tickets-header">
        <h1>ASEGURA TU <span>PRÓXIMA NOCHE</span></h1>
        <p>Selecciona tu entrada para los eventos más exclusivos de salsa</p>
      </header>

      <div className="events-buy-list">
        {eventos.length > 0 ? (
          eventos.map(evento => (
            <section key={evento.id} className="event-buy-section">
              <div className="event-buy-header">
                <div className="event-info-main">
                  <span className="event-city">{evento.ciudad} • {evento.lugar}</span>
                  <h2>{evento.titulo}</h2>
                  <span className="event-date">FECHA: {new Date(evento.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</span>
                </div>
              </div>

              <div className="tiers-grid">
                {evento.tiposTickets && evento.tiposTickets.length > 0 ? (() => {
                  const activeTiers = evento.tiposTickets.filter(t => t.activo !== false);
                  if (activeTiers.length === 0) {
                    return (
                      <div className="no-tiers">
                        <p>Tickets agotados para este evento.</p>
                      </div>
                    );
                  }
                  const sortedTiers = [...activeTiers].sort((a, b) => (a.precio || 0) - (b.precio || 0));
                  const activeTierId = sortedTiers.find(t => t.stockDisponible > 0)?.id;

                  return sortedTiers.map(tier => (
                    <TicketTierCard
                      key={tier.id}
                      tier={tier}
                      isActive={tier.id === activeTierId}
                      isProcessing={processingId === tier.id}
                      onBuy={(tierId, quantity) => handleBuy(evento.id, tierId, quantity)}
                    />
                  ));
                })() : (
                  <div className="no-tiers">
                    <p>Tickets agotados para este evento.</p>
                  </div>
                )}
              </div>
            </section>
          ))
        ) : (
          <p className="no-events">No hay eventos disponibles por el momento.</p>
        )}
      </div>
    </div>
  );
};

export default Tickets;
