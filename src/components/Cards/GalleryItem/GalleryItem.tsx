import React, { memo } from 'react';
import { Camera, Play } from 'lucide-react';
import Skeleton from '../../UI/Skeleton/Skeleton';
import './GalleryItem.css';

interface GalleryMedia {
    id: number;
    thumbnail_url: string;
    titulo?: string;
    es_video: boolean;
}

interface GalleryItemProps {
    item: GalleryMedia;
    isLarge?: boolean;
    isWide?: boolean;
    onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = memo(({ item, isLarge, isWide, onClick }) => {
    return (
        <div
            className={`gallery-item ${isLarge ? 'large' : ''} ${isWide ? 'wide' : ''}`}
            onClick={onClick}
        >
            <img 
                src={item.thumbnail_url} 
                alt={item.titulo || 'Momento Club'} 
                loading="lazy" 
                width="600" 
                height="600" 
            />
            <div className="gallery-item-overlay">
                <div className="overlay-content">
                    <Camera size={20} />
                    <span>VER ÁLBUM</span>
                </div>
            </div>
            {item.es_video && (
                <div className="video-marker">
                    <Play size={16} fill="white" />
                </div>
            )}
        </div>
    );
});

export const GallerySkeleton = ({ isLarge, isWide }: { isLarge?: boolean; isWide?: boolean }) => (
    <Skeleton className={`gallery-item ${isLarge ? 'large' : ''} ${isWide ? 'wide' : ''}`} />
);

export default GalleryItem;
