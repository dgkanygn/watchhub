import { FaHeadphones } from 'react-icons/fa';

/**
 * Oda başlığı bileşeni
 */
export const RoomHeader = ({ status, username }) => {
    return (
        <div className="hidden sm:flex flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-[var(--accent)] to-[var(--coral)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 transform rotate-3">
                    <FaHeadphones className="text-lg sm:text-xl text-white" />
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">Watchub</h1>
                    {status === 'active' && (
                        <span className="flex h-2 w-2 sm:h-3 sm:w-3 relative flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
                        </span>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 sm:gap-3 bg-[var(--card-bg)] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-[var(--border-color)] flex-shrink-0">
                <div className="text-right hidden xs:block">
                    <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">İzleyen</p>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--accent-light)] truncate max-w-[80px] sm:max-w-none">
                        {username}
                    </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--coral)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                    <span className="text-white font-bold text-sm sm:text-base">{username?.charAt(0).toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};
