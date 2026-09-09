import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'accent' | 'gallery' | 'buy';
    children: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    children, 
    className = '', 
    fullWidth = false,
    ...props 
}) => {
    const variantClass = `btn-${variant}`;
    const widthClass = fullWidth ? 'btn-full-width' : '';
    
    return (
        <button 
            className={`btn-base ${variantClass} ${widthClass} ${className}`} 
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
