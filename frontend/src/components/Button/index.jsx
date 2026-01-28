import React from 'react';

export const Button = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95';

    const variants = {
        primary: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent)]/25 hover:shadow-[var(--accent)]/40 hover:brightness-110 border border-transparent',
        secondary: 'bg-[var(--card-bg)] hover:bg-[var(--card-hover)] text-zinc-100 border border-[var(--border-color)] hover:border-[var(--accent)]/50',
        danger: 'bg-gradient-to-r from-[var(--coral)] to-[var(--coral-hover)] text-white shadow-lg shadow-[var(--coral)]/25 hover:shadow-[var(--coral)]/40',
        ghost: 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
