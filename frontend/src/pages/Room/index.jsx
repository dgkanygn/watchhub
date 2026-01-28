import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// components
import {
    VideoPlayer,
    ActionBar,
    SidePanel,
    RoomHeader,
    JoinScreen,
    LoadingScreen,
    VideoModal
} from './components';

// utils
import { extractVideoId } from './utils';

const SOCKET_URL = 'http://localhost:3001';

export default function RoomPage() {
    const params = useParams();
    const roomId = params.id;
    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = useState(location.state?.username || '');
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(!location.state?.username);
    const [tempUsername, setTempUsername] = useState('');

    const [status, setStatus] = useState('loading');
    const [activeTab, setActiveTab] = useState('chat');

    const [socket, setSocket] = useState(null);
    const [videoState, setVideoState] = useState({
        videoId: '',
        isPlaying: false,
        playbackTime: 0,
        muted: false
    });

    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [hasControl, setHasControl] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');

    const [isEnded, setIsEnded] = useState(false);

    const [chatInput, setChatInput] = useState('');

    const playerRef = useRef(null);
    const isPlayerReady = useRef(false);
    const videoStateRef = useRef(videoState);
    const pendingSyncRef = useRef(null);

    useEffect(() => {
        videoStateRef.current = videoState;
    }, [videoState]);

    const handleJoinRoom = useCallback(() => {
        if (!tempUsername.trim()) return;
        setUsername(tempUsername);
        setIsUsernameModalOpen(false);
    }, [tempUsername]);

    const applyVideoState = useCallback((newState, prevState) => {
        if (!playerRef.current || !isPlayerReady.current) {
            pendingSyncRef.current = newState;
            return;
        }

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

        const currentTime = playerRef.current.getCurrentTime();
        if (newState.playbackTime !== undefined && Math.abs(currentTime - newState.playbackTime) > 2) {
            playerRef.current.seekTo(newState.playbackTime, true);
        }

        const playerState = playerRef.current.getPlayerState();
        if (newState.isPlaying && playerState !== 1) {
            playerRef.current.playVideo();
        } else if (!newState.isPlaying && playerState === 1) {
            playerRef.current.pauseVideo();
        }
    }, []);

    const createPlayer = useCallback((initialVideoId) => {
        if (playerRef.current) return;

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
                },
                'onStateChange': (event) => {
                    if (event.data === 0) {
                        setIsEnded(true);
                    } else if (event.data === 1) {
                        setIsEnded(false);
                    }
                }
            }
        });
    }, []);

    useEffect(() => {
        if (!username) return;

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket', newSocket.id);
            newSocket.emit('join-room', {
                roomId,
                username,
                // roomName: roomName
            });
        });

        newSocket.on('room-state', (state) => {
            setStatus('active');
            setVideoState(state);

            if (playerRef.current && isPlayerReady.current) {
                applyVideoState(state, videoStateRef.current);
            } else {
                pendingSyncRef.current = state;
            }
        });

        newSocket.on('update-users', (users) => {
            setParticipants(users);
            const currentUser = users.find(u => u.username === username);
            if (currentUser) {
                setHasControl(currentUser.hasControl);
                setIsHost(currentUser.isHost);
            }
        });

        newSocket.on('kicked', () => {
            alert('Odadan atıldın!');
            navigate('/');
        });

        newSocket.on('receive-message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        newSocket.on('sync-request', ({ requesterId }) => {
            if (playerRef.current && isPlayerReady.current) {
                const currentTime = playerRef.current.getCurrentTime();
                const playerState = playerRef.current.getPlayerState();
                const isPlaying = playerState === 1;

                newSocket.emit('sync-response', {
                    roomId,
                    time: currentTime,
                    isPlaying,
                    requesterId
                });
            }
        });

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            createPlayer(videoState.videoId);
        };

        if (window.YT && window.YT.Player) {
            createPlayer(videoState.videoId);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [roomId, username, createPlayer, applyVideoState]);

    const handleSendMessage = useCallback(() => {
        if (!chatInput.trim() || !socket) return;
        socket.emit('send-message', { roomId, message: chatInput });
        setChatInput('');
    }, [chatInput, socket, roomId]);

    const handleVideoSubmit = useCallback(() => {
        const videoId = extractVideoId(newVideoUrl);
        console.log('Video URL:', newVideoUrl);
        console.log('Video ID:', videoId);
        console.log('Socket:', socket);
        console.log('Room ID:', roomId);
        if (videoId && socket) {
            console.log('Video ID:', videoId);
            socket.emit('set-video', { roomId, videoId });
            setIsVideoModalOpen(false);
            setNewVideoUrl('');
        }
    }, [newVideoUrl, socket, roomId]);

    const togglePlay = useCallback(() => {
        if (!socket) return;
        if (videoState.isPlaying) {
            socket.emit('pause', { roomId });
        } else {
            socket.emit('play', { roomId });
        }
    }, [socket, roomId, videoState.isPlaying]);

    const seek = useCallback((seconds) => {
        if (!socket || !playerRef.current || !isPlayerReady.current) return;
        const currentTime = playerRef.current.getCurrentTime();
        const newTime = currentTime + seconds;
        socket.emit('seek', { roomId, time: newTime });
    }, [socket, roomId]);

    const handleTransferControl = useCallback((targetUserId) => {
        if (!socket) return;
        socket.emit('transfer-control', { roomId, targetUserId });
    }, [socket, roomId]);

    const handleKickUser = useCallback((targetUserId) => {
        if (!socket) return;
        socket.emit('kick-user', { roomId, targetUserId });
    }, [socket, roomId]);

    if (isUsernameModalOpen) {
        return (
            <JoinScreen
                tempUsername={tempUsername}
                onTempUsernameChange={setTempUsername}
                onJoin={handleJoinRoom}
            />
        );
    }

    if (status === 'loading') {
        return <LoadingScreen />;
    }

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 min-h-screen lg:h-[calc(100vh-2rem)] flex flex-col overflow-y-auto lg:overflow-hidden">
            <RoomHeader
                status={status}
                username={username}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 flex-1 lg:min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 lg:min-h-0">
                    <VideoPlayer
                        hasVideo={!!videoState.videoId}
                        isPlaying={videoState.isPlaying}
                        isEnded={isEnded}
                    />

                    <ActionBar
                        isPlaying={videoState.isPlaying}
                        onTogglePlay={togglePlay}
                        onSeek={seek}
                        onAddVideo={() => setIsVideoModalOpen(true)}
                        participants={participants}
                        hasControl={hasControl}
                    />
                </div>

                <SidePanel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    messages={messages}
                    participants={participants}
                    currentUsername={username}
                    chatInput={chatInput}
                    onChatInputChange={setChatInput}
                    onSendMessage={handleSendMessage}
                    isHost={isHost}
                    onTransferControl={handleTransferControl}
                    onKickUser={handleKickUser}
                />
            </div>

            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                videoUrl={newVideoUrl}
                onVideoUrlChange={setNewVideoUrl}
                onSubmit={handleVideoSubmit}
            />
        </div>
    );
}
