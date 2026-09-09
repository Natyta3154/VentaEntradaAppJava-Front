import React, { memo } from 'react';
import Skeleton from '../../UI/Skeleton/Skeleton';
import './DjCard.css';

interface Dj {
    id: number;
    nombre: string;
    foto?: string;
    estilo_musical: string;
    biografia: string;
}

interface DjCardProps {
    dj: Dj;
}

const DjCard: React.FC<DjCardProps> = memo(({ dj }) => {
    return (
        <div className="dj-card">
            <div className="dj-badge">ARTISTA</div>
            <div className="dj-image-wrapper">
                <img
                    src={dj.foto || "https://images.unsplash.com/photo-1571266028243-3716f02d2dcd?q=80&w=400"}
                    alt={dj.nombre}
                    loading="lazy"
                    width="400"
                    height="400"
                />
            </div>
            <div className="dj-info-overlay">
                <span className="dj-style">{dj.estilo_musical}</span>
                <h3>{dj.nombre}</h3>
                <div className="dj-bio">
                    {dj.biografia}
                </div>
            </div>
        </div>
    );
});

export const DjCardSkeleton = () => (
    <div className="dj-card skeleton-card">
        <div className="dj-image-wrapper">
            <Skeleton variant="circle" height={280} width={280} />
        </div>
        <div className="dj-info-overlay">
            <Skeleton height={20} width="60%" className="mb-2" />
            <Skeleton height={30} width="80%" className="mb-4" />
            <Skeleton height={15} width="90%" className="mb-2" />
            <Skeleton height={15} width="70%" />
        </div>
    </div>
);

export default DjCard;
