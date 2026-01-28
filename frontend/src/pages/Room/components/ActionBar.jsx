import { Button } from '@/components/Button';
import { FaPlay, FaPause, FaForward, FaBackward, FaPlus } from 'react-icons/fa';

/**
 * Video kontrol çubuğu bileşeni
 */
export const ActionBar = ({
    isPlaying,
    onTogglePlay,
    onSeek,
    onAddVideo,
    participants,
    hasControl
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-[var(--card-bg)]/60 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[var(--border-color)]">
            {/* Controls - Only shown if user has control */}
            {hasControl ? (
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                            onClick={() => onSeek(-10)}
                            variant="secondary"
                            className="!px-2.5 !py-2 sm:!px-3"
                            title="10s Geri"
                        >
                            <FaBackward className="text-xs sm:text-sm" />
                        </Button>
                        <Button
                            onClick={onTogglePlay}
                            variant="primary"
                            className="!rounded-full !w-10 !h-10 sm:!w-12 sm:!h-12 !p-0 flex items-center justify-center"
                        >
                            {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                        </Button>
                        <Button
                            onClick={() => onSeek(10)}
                            variant="secondary"
                            className="!px-2.5 !py-2 sm:!px-3"
                            title="10s İleri"
                        >
                            <FaForward className="text-xs sm:text-sm" />
                        </Button>
                    </div>

                    <div className="h-6 sm:h-8 w-px bg-[var(--border-color)] mx-1 sm:mx-2 hidden xs:block"></div>

                    <Button
                        onClick={onAddVideo}
                        variant="ghost"
                        className="!text-xs sm:!text-sm border border-[var(--border-color)] !px-2 sm:!px-4"
                    >
                        <FaPlus className="mr-1 sm:mr-2 text-xs" />
                        <span className="hidden xs:inline">Video</span> Aç
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-zinc-500 text-xs sm:text-sm">
                    <span className="px-3 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                        İzleyici modundasın
                    </span>
                </div>
            )}

            {/* Participants Info */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                    {participants.length} kişi
                </span>
                <div className="flex -space-x-1.5 sm:-space-x-2">
                    {participants.slice(0, 3).map((p, idx) => (
                        <div
                            key={idx}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[var(--card-bg)] ${p.avatar} flex items-center justify-center text-white text-[10px] sm:text-xs font-bold`}
                            title={p.username}
                        >
                            {p.username.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {participants.length > 3 && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[var(--card-bg)] bg-zinc-700 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                            +{participants.length - 3}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
