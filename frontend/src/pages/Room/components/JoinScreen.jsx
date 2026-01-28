import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { FaHeadphones } from 'react-icons/fa';

/**
 * Odaya katılmadan önce kullanıcı adı isteme ekranı
 */
export const JoinScreen = ({ tempUsername, onTempUsernameChange, onJoin }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onJoin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-[var(--coral)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative z-10">
                <div className="text-center mb-6 sm:mb-10">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-tr from-[var(--accent)] to-[var(--coral)] rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 mb-4 sm:mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                        <FaHeadphones className="text-2xl sm:text-4xl text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Watchub</h1>
                    <p className="text-sm sm:text-base text-zinc-400">Mevcut bir odaya katılmak üzeresin.</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-xs text-[var(--accent-light)]">Oda aktif</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                        <Input
                            label="Kullanıcı Adı"
                            placeholder="Adın ne olsun?"
                            value={tempUsername}
                            onChange={(e) => onTempUsernameChange(e.target.value)}
                            className="text-base sm:text-lg bg-[var(--background)]/50 focus:bg-[var(--background)]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3 sm:py-4"
                        disabled={!tempUsername.trim()}
                    >
                        Katıl
                    </Button>
                </form>
            </div>
        </div>
    );
};
