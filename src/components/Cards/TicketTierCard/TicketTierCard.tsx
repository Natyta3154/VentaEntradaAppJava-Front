import React, { memo, useState } from 'react';
import { Ticket } from 'lucide-react';
import Button from '../../UI/Button/Button';
import './TicketTierCard.css';

import { TicketType } from '../../../types';

interface TicketTierCardProps {
    tier: TicketType;
    isProcessing: boolean;
    isActive: boolean;
    onBuy: (tierId: number, quantity: number) => void;
}

const TicketTierCard: React.FC<TicketTierCardProps> = memo(({ tier, isProcessing, isActive, onBuy }) => {
    const isSoldOut = tier.stockDisponible === 0;
    const isLowStock = tier.stockDisponible > 0 && tier.stockDisponible <= 15;
    const [quantity, setQuantity] = useState(1);
    const maxQuantity = Math.min(5, tier.stockDisponible); // Límite de 5 entradas por usuario o stock disponible

    return (
        <div className={`ticket-tier-card ${isSoldOut ? 'is-sold-out' : ''} ${isActive ? 'is-active' : ''}`}>
            {isActive && <div className="active-badge">FASE ACTUAL</div>}

            <div className="tier-header">
                <span className="tier-label">
                    {isSoldOut ? 'Fase Finalizada' : isActive ? '¡Consíguela ahora!' : 'Próxima Fase'}
                </span>
                <h2 className="tier-title">{tier.nombre}</h2>
            </div>

            <div className="tier-body">
                <div className="tier-price">
                    <span className="currency">$</span>
                    <span className="amount">{tier.precio}</span>
                </div>

                {isSoldOut ? (
                    <div className="sold-out-badge">AGOTADAS</div>
                ) : (
                    <div className={`stock-info ${isLowStock ? 'is-urgent' : ''}`}>
                        {isSoldOut ? 'FASE FINALIZADA' :
                            isLowStock ? `¡SÓLO QUEDAN ${tier.stockDisponible}!` :
                                `DISPONIBLES: ${tier.stockDisponible} ENTRADAS`}
                    </div>
                )}

                {isActive && !isSoldOut && (
                    <div className="quantity-selector">
                        <button 
                            className="qty-btn" 
                            disabled={quantity <= 1} 
                            onClick={() => setQuantity(q => q - 1)}
                        >-</button>
                        <span className="qty-display">{quantity}</span>
                        <button 
                            className="qty-btn" 
                            disabled={quantity >= maxQuantity} 
                            onClick={() => setQuantity(q => q + 1)}
                        >+</button>
                    </div>
                )}
            </div>

            <div className="tier-footer">
                <Button
                    variant={isActive ? "accent" : "buy"}
                    fullWidth
                    disabled={isSoldOut || isProcessing || (!isActive && !isSoldOut)}
                    onClick={() => onBuy(tier.id, quantity)}
                >
                    {isSoldOut ? 'AGOTADO' :
                        isProcessing ? 'CARGANDO...' :
                            isActive ? 'ADQUIRIR AHORA' : 'AÚN NO DISPONIBLE'}
                </Button>
            </div>

            {isSoldOut && <div className="overlay-sold-out"></div>}
            {!isActive && !isSoldOut && <div className="overlay-future"></div>}
        </div>
    );
});

export default TicketTierCard;
