import Modal from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

/**
 * Video ekleme modal bileşeni
 */
export const VideoModal = ({ isOpen, onClose, videoUrl, onVideoUrlChange, onSubmit }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Video Ekle"
        >
            <div className="space-y-6">
                <Input
                    label="YouTube Linki"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => onVideoUrlChange(e.target.value)}
                    className="!bg-[var(--background)] !text-white placeholder:text-zinc-500 border-[var(--border-color)] focus:border-[var(--accent)]"
                    autoFocus
                />

                <Button
                    onClick={onSubmit}
                    disabled={!videoUrl.trim()}
                    className="w-full justify-center"
                >
                    Videoyu Oynat
                </Button>
            </div>
        </Modal>
    );
};
