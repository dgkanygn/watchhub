/**
 * Yükleme ekranı bileşeni
 */
export const LoadingScreen = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-medium text-zinc-400">Sunucuya Bağlanılıyor...</h2>
        </div>
    );
};
