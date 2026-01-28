import { useState, useRef, useEffect } from 'react';
import { FaCrown, FaEllipsisV, FaGamepad, FaUserSlash, FaTimes } from 'react-icons/fa';

/**
 * Katılımcı listesi bileşeni
 */
export const ParticipantsList = ({
    participants,
    currentUsername,
    isHost,
    onTransferControl,
    onKickUser
}) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTransferControl = (participantId) => {
        onTransferControl(participantId);
        setOpenMenuId(null);
    };

    const handleKickUser = (participantId) => {
        onKickUser(participantId);
        setOpenMenuId(null);
    };

    return (
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
            <div className="space-y-2 sm:space-y-3">
                {participants.map((participant, idx) => {
                    const isCurrentUser = participant.username === currentUsername;
                    const canManage = isHost && !isCurrentUser && !participant.isHost;

                    return (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all
                                ${isCurrentUser
                                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-[var(--accent)]/10 shadow-lg'
                                    : 'bg-[var(--card-bg)]/50 border-transparent hover:bg-[var(--card-hover)] hover:border-[var(--border-color)]'
                                }`}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${participant.avatar} flex items-center justify-center text-white font-bold text-sm sm:text-base border-2 ${isCurrentUser ? 'border-[var(--accent)]' : 'border-transparent'}`}>
                                    {participant.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 ${isCurrentUser ? 'text-[var(--accent-light)]' : 'text-white'}`}>
                                        <span className="truncate max-w-[100px] sm:max-w-none">
                                            {participant.username}
                                            {isCurrentUser && <span className="text-[10px] opacity-70 ml-1">(Sen)</span>}
                                        </span>
                                        {participant.isHost && <FaCrown className="text-yellow-500 text-[10px] sm:text-xs flex-shrink-0" title="Oda Sahibi" />}
                                        {participant.hasControl && !participant.isHost && (
                                            <FaGamepad className="text-[var(--accent)] text-[10px] sm:text-xs flex-shrink-0" title="Kontrol Sahibi" />
                                        )}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-zinc-500">
                                        {participant.isHost ? 'Oda Sahibi' : participant.hasControl ? 'Kontrolde' : 'İzleyici'}
                                    </p>
                                </div>
                            </div>

                            {/* Three dot menu - only for host to manage other users */}
                            {canManage && (
                                <div className="relative" ref={openMenuId === participant.id ? menuRef : null}>
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === participant.id ? null : participant.id)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                    >
                                        <FaEllipsisV className="text-xs" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openMenuId === participant.id && (
                                        <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 min-w-[140px] overflow-hidden">
                                            <button
                                                onClick={() => handleTransferControl(participant.id)}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-zinc-700/50 transition-colors text-zinc-300 hover:text-white"
                                            >
                                                <FaGamepad className="text-[var(--accent)]" />
                                                Kontrol Ver
                                            </button>
                                            <button
                                                onClick={() => handleKickUser(participant.id)}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                                            >
                                                <FaUserSlash />
                                                Odadan At
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Show control badge for current user if they have control */}
                            {isCurrentUser && participant.hasControl && (
                                <div className="px-2 py-1 bg-[var(--accent)]/20 rounded-md">
                                    <span className="text-[10px] text-[var(--accent-light)] font-medium">Kontrol</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
