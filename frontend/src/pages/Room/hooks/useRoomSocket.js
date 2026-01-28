import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

/**
 * Oda socket bağlantısı için custom hook
 */
export const useRoomSocket = (roomId, username, roomName, onVideoStateChange) => {
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('loading');
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoomName, setCurrentRoomName] = useState(roomName);

    useEffect(() => {
        if (!username) return;

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket', newSocket.id);
            newSocket.emit('join-room', {
                roomId,
                username,
                roomName: roomName
            });
        });

        newSocket.on('room-state', (state) => {
            if (state.name && !currentRoomName) {
                setCurrentRoomName(state.name);
            }
            setStatus('active');
            onVideoStateChange?.(state);
        });

        newSocket.on('update-users', (users) => {
            setParticipants(users);
        });

        newSocket.on('receive-message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId, username]);

    // Socket Actions
    const sendMessage = useCallback((message) => {
        if (!socket || !message.trim()) return;
        socket.emit('send-message', { roomId, message });
    }, [socket, roomId]);

    const setVideo = useCallback((videoId) => {
        if (!socket || !videoId) return;
        socket.emit('set-video', { roomId, videoId });
    }, [socket, roomId]);

    const play = useCallback(() => {
        if (!socket) return;
        socket.emit('play', { roomId });
    }, [socket, roomId]);

    const pause = useCallback(() => {
        if (!socket) return;
        socket.emit('pause', { roomId });
    }, [socket, roomId]);

    const seek = useCallback((time) => {
        if (!socket) return;
        socket.emit('seek', { roomId, time });
    }, [socket, roomId]);

    const sendSyncResponse = useCallback((time, isPlaying, requesterId) => {
        if (!socket) return;
        socket.emit('sync-response', { roomId, time, isPlaying, requesterId });
    }, [socket, roomId]);

    const onSyncRequest = useCallback((handler) => {
        if (!socket) return () => { };
        socket.on('sync-request', handler);
        return () => socket.off('sync-request', handler);
    }, [socket]);

    return {
        socket,
        status,
        participants,
        messages,
        roomName: currentRoomName,
        actions: {
            sendMessage,
            setVideo,
            play,
            pause,
            seek,
            sendSyncResponse,
            onSyncRequest
        }
    };
};
