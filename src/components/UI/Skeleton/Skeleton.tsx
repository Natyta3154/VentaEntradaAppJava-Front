import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    variant?: 'text' | 'rect' | 'circle';
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
    width, 
    height, 
    borderRadius, 
    variant = 'rect', 
    className = '' 
}) => {
    const style: React.CSSProperties = {
        width,
        height,
        borderRadius: borderRadius || (variant === 'circle' ? '50%' : '8px'),
    };

    return (
        <div 
            className={`skeleton skeleton-${variant} ${className}`} 
            style={style}
        />
    );
};

export default Skeleton;
