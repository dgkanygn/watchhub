export default function Modal({
    isOpen,
    onClose,
    title,
    children,
}) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg p-4 sm:p-6 relative overflow-hidden max-h-[85vh] sm:max-h-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-center mb-4 sm:mb-6 relative z-10">
                    <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
                    <button
                        className="text-zinc-400 cursor-pointer text-2xl hover:text-white transition-colors p-1"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <div className="relative z-10">{children}</div>

                {/* Safe area padding for iOS */}
                <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
            </div>
        </div>
    );
}
