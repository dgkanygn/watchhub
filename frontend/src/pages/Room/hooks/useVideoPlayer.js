import { useRef, useCallback } from 'react';

/**
 * YouTube IFrame Player yönetimi için custom hook
 */
export const useVideoPlayer = () => {
    const playerRef = useRef(null);
    const isPlayerReady = useRef(false);
    const pendingSyncRef = useRef(null);

    /**
     * YouTube Player'ı oluşturur
     */
    const createPlayer = useCallback((initialVideoId, onReady) => {
        if (playerRef.current) return;

        // YouTube IFrame API'yi yükle
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: initialVideoId || '',
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'disablekb': 1,
                    'rel': 0,
                    'fs': 0,
                    'showinfo': 0,
                    'iv_load_policy': 3
                },
                events: {
                    'onReady': () => {
                        isPlayerReady.current = true;
                        console.log('YouTube Player ready');

                        // Bekleyen sync verisini uygula
                        if (pendingSyncRef.current) {
                            const pendingState = pendingSyncRef.current;
                            console.log('Applying pending sync:', pendingState);

                            if (pendingState.videoId) {
                                playerRef.current.loadVideoById({
                                    videoId: pendingState.videoId,
                                    startSeconds: pendingState.playbackTime || 0
                                });

                                setTimeout(() => {
                                    if (pendingState.isPlaying) {
                                        playerRef.current.playVideo();
                                    } else {
                                        playerRef.current.pauseVideo();
                                    }
                                }, 1000);
                            }

                            pendingSyncRef.current = null;
                        }

                        onReady?.();
                    }
                }
            });
        };

        window.onYouTubeIframeAPIReady = initPlayer;

        // API zaten yüklüyse direkt başlat
        if (window.YT && window.YT.Player) {
            initPlayer();
        }
    }, []);

    /**
     * Video state'ini player'a uygular
     */
    const applyVideoState = useCallback((newState, prevState) => {
        if (!playerRef.current || !isPlayerReady.current) {
            // Player hazır değilse bekleyen sync olarak kaydet
            pendingSyncRef.current = newState;
            return;
        }

        // Video ID değişimi
        if (newState.videoId && newState.videoId !== prevState?.videoId) {
            playerRef.current.loadVideoById({
                videoId: newState.videoId,
                startSeconds: newState.playbackTime || 0
            });

            setTimeout(() => {
                if (newState.isPlaying) {
                    playerRef.current.playVideo();
                } else {
                    playerRef.current.pauseVideo();
                }
            }, 500);
            return;
        }

        // Seek (fark 2 saniyeden fazlaysa)
        const currentTime = playerRef.current.getCurrentTime();
        if (newState.playbackTime !== undefined && Math.abs(currentTime - newState.playbackTime) > 2) {
            playerRef.current.seekTo(newState.playbackTime, true);
        }

        // Play/Pause
        const playerState = playerRef.current.getPlayerState();
        if (newState.isPlaying && playerState !== 1) {
            playerRef.current.playVideo();
        } else if (!newState.isPlaying && playerState === 1) {
            playerRef.current.pauseVideo();
        }
    }, []);

    /**
     * Mevcut oynatma zamanını döndürür
     */
    const getCurrentTime = useCallback(() => {
        if (!playerRef.current || !isPlayerReady.current) return 0;
        return playerRef.current.getCurrentTime();
    }, []);

    /**
     * Player state'ini döndürür (1 = playing)
     */
    const getPlayerState = useCallback(() => {
        if (!playerRef.current || !isPlayerReady.current) return -1;
        return playerRef.current.getPlayerState();
    }, []);

    return {
        playerRef,
        isPlayerReady,
        pendingSyncRef,
        createPlayer,
        applyVideoState,
        getCurrentTime,
        getPlayerState
    };
};
