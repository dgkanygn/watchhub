import { FaComments, FaUsers } from 'react-icons/fa';
import { ChatPanel } from './ChatPanel';
import { ParticipantsList } from './ParticipantsList';

/**
 * Sağ panel - Sohbet ve Katılımcılar tab'ları
 */
export const SidePanel = ({
    activeTab,
    onTabChange,
    messages,
    participants,
    currentUsername,
    chatInput,
    onChatInputChange,
    onSendMessage,
    isHost,
    onTransferControl,
    onKickUser
}) => {
    return (
        <div className="flex flex-col bg-[var(--card-bg)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl h-[350px] sm:h-[400px] lg:h-full lg:min-h-0">
            {/* Tab Headers */}
            <div className="flex border-b border-[var(--border-color)] flex-shrink-0">
                <button
                    onClick={() => onTabChange('chat')}
                    className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-all relative
                        ${activeTab === 'chat' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                >
                    <FaComments className="text-sm" /> Sohbet
                    {activeTab === 'chat' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)] animate-fade-in" />
                    )}
                </button>
                <button
                    onClick={() => onTabChange('participants')}
                    className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-all relative
                        ${activeTab === 'participants' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                >
                    <FaUsers className="text-sm" />
                    <span className="hidden xs:inline">Katılımcılar</span>
                    <span className="xs:hidden">({participants.length})</span>
                    {activeTab === 'participants' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)] animate-fade-in" />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' ? (
                <ChatPanel
                    messages={messages}
                    currentUsername={currentUsername}
                    chatInput={chatInput}
                    onChatInputChange={onChatInputChange}
                    onSendMessage={onSendMessage}
                />
            ) : (
                <ParticipantsList
                    participants={participants}
                    currentUsername={currentUsername}
                    isHost={isHost}
                    onTransferControl={onTransferControl}
                    onKickUser={onKickUser}
                />
            )}
        </div>
    );
};
