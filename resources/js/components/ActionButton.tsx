import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    variant: 'primary' | 'danger' | 'warning';
    type?: "button" | "submit";
}

export default function ActionButton({ onClick, children, variant, type = "button" }: ButtonProps) {
    const bg = {
        primary: '#2563eb',
        danger: '#ef4444',
        warning: '#eab308'
    }[variant];

    return (
        <button 
            type={type}
            onClick={onClick} 
            style={{ background: bg, color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
        >
            {children}
        </button>
    );
}