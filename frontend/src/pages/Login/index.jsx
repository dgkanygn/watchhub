import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { FaPlay, FaHeadphones, FaPlus } from 'react-icons/fa';

export default function Login() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (!nickname.trim()) return;

        const roomId = Math.random().toString(36).substring(2, 9);

        // Navigate with state
        navigate(`/room/${roomId}`, {
            state: {
                username: nickname
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--coral)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[var(--accent)] to-[var(--coral)] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                        <FaHeadphones className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Watchub</h1>
                    <p className="text-zinc-400">Arkadaşlarınla video izle ve sohbet et.</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-full">
                        <FaPlus className="text-[var(--accent-light)] text-xs" />
                        <span className="text-sm text-[var(--accent-light)]">Yeni bir oda yaratmak üzeresin</span>
                    </div>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Kullanıcı Adı"
                            placeholder="Adın ne olsun?"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="text-lg bg-[var(--background)]/50 focus:bg-[var(--background)]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-4 text-lg shadow-xl shadow-[var(--accent)]/20"
                        disabled={!nickname.trim()}
                    >
                        <FaPlay /> Odayı Oluştur ve Başla
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
                    <p className="text-zinc-500 text-sm">
                        Bir davet linkin varsa direkt URL'e gidebilirsin.
                    </p>
                </div>
            </div>
        </div>
    );
}
