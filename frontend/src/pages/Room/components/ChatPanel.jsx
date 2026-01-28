import { useRef, useEffect } from 'react';
import { Input } from '@/components/Input';
import { FaPaperPlane } from 'react-icons/fa';

/**
 * Sohbet paneli bileşeni
 */
export const ChatPanel = ({
    messages,
    currentUsername,
    chatInput,
    onChatInputChange,
    onSendMessage
}) => {
    const chatEndRef = useRef(null);

    // Otomatik scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage();
    };

    return (
        <>
            {/* Mesaj Listesi */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar relative">
                <div className="space-y-2 sm:space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col ${msg.user === currentUsername ? 'items-end' : 'items-start'} ${msg.isSystem ? 'items-center !w-full' : ''}`}
                        >
                            {msg.isSystem ? (
                                <span className="bg-zinc-800/50 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] text-zinc-400 border border-zinc-700/50">
                                    {msg.text}
                                </span>
                            ) : (
                                <>
                                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                        <span className={`text-[10px] sm:text-xs font-bold ${msg.user === currentUsername ? 'text-[var(--accent-light)]' : 'text-zinc-300'}`}>
                                            {msg.user}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] text-zinc-500">{msg.time}</span>
                                    </div>
                                    <div className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl max-w-[90%] sm:max-w-[85%] text-xs sm:text-sm break-words
                                        ${msg.user === currentUsername
                                            ? 'bg-[var(--accent)] text-white rounded-br-none'
                                            : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-zinc-200 rounded-bl-none'}`}
                                    >
                                        {msg.text}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Chat Input */}
            <div className="p-2 sm:p-4 border-t border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md flex-shrink-0">
                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        placeholder="Bir mesaj yaz..."
                        value={chatInput}
                        onChange={(e) => onChatInputChange(e.target.value)}
                        className="!bg-[var(--background)]/50 pr-10 sm:pr-12 !py-2 sm:!py-3 !text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-[var(--accent)] hover:text-white hover:bg-[var(--accent)] rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--accent)] z-10"
                    >
                        <FaPaperPlane className="text-xs" />
                    </button>
                </form>
            </div>
        </>
    );
};
