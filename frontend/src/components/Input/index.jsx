import React from 'react';

export const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full group">
            {label && (
                <label className="block text-sm font-medium text-zinc-400 mb-2 group-focus-within:text-[var(--accent-light)] transition-colors">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 bg-[var(--card-bg)]/50 border border-[var(--border-color)] rounded-xl
          text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 
          focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-all 
          backdrop-blur-sm hover:border-[var(--accent)]/30 ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-[var(--coral)]">{error}</p>}
        </div>
    );
};
