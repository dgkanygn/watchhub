import { FaYoutube, FaPause, FaRedo } from 'react-icons/fa';

/**
 * Video Player bileşeni - YouTube IFrame'i ve overlay'leri içerir
 */
export const VideoPlayer = ({ hasVideo, isPlaying, isEnded }) => {
    return (
        <div className="relative aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-xl sm:shadow-2xl group flex-shrink-0">
            {/* YouTube Player Div */}
            <div id="youtube-player" className="absolute inset-0 w-full h-full" />

            {/* Overlay to block direct interaction */}
            <div className="absolute inset-0 z-10 w-full h-full bg-transparent" />

            {/* Fallback/Overlay when no video */}
            {!hasVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50 backdrop-blur-sm z-10 pointer-events-none p-4">
                    <FaYoutube className="text-4xl sm:text-6xl text-red-600 mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <p className="font-medium text-sm sm:text-lg text-center">Müzik Bekleniyor...</p>
                    <p className="text-xs sm:text-sm text-zinc-600 mt-1 sm:mt-2 text-center">
                        <span className="hidden sm:inline">Bir video eklemek için aşağıdan "Video Aç" butonuna tıkla</span>
                        <span className="sm:hidden">Video Aç butonuna tıkla</span>
                    </p>
                </div>
            )}

            {/* Paused Overlay */}
            {hasVideo && !isPlaying && !isEnded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20 pointer-events-none transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-4 sm:p-6 mb-3 sm:mb-4 border border-white/20 shadow-2xl">
                        <FaPause className="text-3xl sm:text-5xl text-white drop-shadow-lg" />
                    </div>
                    <p className="text-white font-semibold text-sm sm:text-lg drop-shadow-md">Duraklatıldı</p>
                </div>
            )}

            {/* Video Ended Overlay */}
            {hasVideo && isEnded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20 pointer-events-none transition-opacity duration-300">
                    <div className="bg-gradient-to-tr from-[var(--accent)]/20 to-[var(--coral)]/20 backdrop-blur-md rounded-full p-4 sm:p-6 mb-3 sm:mb-4 border border-white/20 shadow-2xl">
                        <FaRedo className="text-3xl sm:text-5xl text-white drop-shadow-lg" />
                    </div>
                    <p className="text-white font-semibold text-sm sm:text-lg drop-shadow-md">Video Sona Erdi</p>
                    <p className="text-zinc-300 text-xs sm:text-sm mt-1 sm:mt-2">Tekrar başlatmak için Play'e tıkla</p>
                </div>
            )}
        </div>
    );
};
