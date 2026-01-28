import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// memory state
const roomStates = {};
// { 
//   roomId: { 
//     name: string,
//     videoId: string, 
//     isPlaying: boolean, 
//     playbackTime: number, 
//     muted: boolean,
//     users: [ { id, username, isHost, hasControl } ]
//   } 
// }

console.log(roomStates);

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("join-room", ({ roomId, username }) => {
        socket.join(roomId);

        // Initialize room if not exists
        if (!roomStates[roomId]) {
            roomStates[roomId] = {
                name: "WatchHub Room",
                videoId: "",
                isPlaying: false,
                playbackTime: 0,
                muted: false,
                users: []
            };
        }

        // Add user to room
        const isFirstUser = roomStates[roomId].users.length === 0;
        const user = {
            id: socket.id,
            username: username || `Misafir-${socket.id.substring(0, 4)}`,
            isHost: isFirstUser, // First user is host
            hasControl: isFirstUser, // First user has control
            avatar: `bg-${['indigo', 'green', 'pink', 'blue', 'yellow', 'purple', 'red'][Math.floor(Math.random() * 7)]}-500`
        };

        roomStates[roomId].users.push(user);

        // Send initial state to user
        socket.emit("room-state", roomStates[roomId]);

        // Broadcast new user list to room
        io.to(roomId).emit("update-users", roomStates[roomId].users);

        // Broadcast system message
        io.to(roomId).emit("receive-message", {
            id: Date.now(),
            user: "Sistem",
            text: `${user.username} odaya katıldı.`,
            time: Date.now(),
            isSystem: true
        });

        // If there are other users, ask the host for current video state to sync the new user
        if (roomStates[roomId].users.length > 1) {
            const host = roomStates[roomId].users[0];
            io.to(host.id).emit("sync-request", { serverRequest: true, requesterId: user.id });
        }
    });

    socket.on("send-message", ({ roomId, message }) => {
        const room = roomStates[roomId];
        if (!room) return;

        const user = room.users.find(u => u.id === socket.id);
        if (!user) return;

        const msgData = {
            id: Date.now(),
            user: user.username,
            text: message,
            time: Date.now(),
            isSystem: false
        };

        io.to(roomId).emit("receive-message", msgData);
    });

    // Helper function to check if user has control
    const hasControl = (roomId, socketId) => {
        const room = roomStates[roomId];
        if (!room) return false;
        const user = room.users.find(u => u.id === socketId);
        return user?.hasControl === true;
    };

    socket.on("set-video", ({ roomId, videoId }) => {
        if (!roomStates[roomId]) return;
        if (!hasControl(roomId, socket.id)) return; // Check control

        console.log(videoId);
        roomStates[roomId].videoId = videoId;
        roomStates[roomId].isPlaying = false;
        roomStates[roomId].playbackTime = 0;
        io.to(roomId).emit("room-state", roomStates[roomId]);
    });

    socket.on("play", ({ roomId }) => {
        if (!roomStates[roomId]) return;
        if (!hasControl(roomId, socket.id)) return; // Check control

        roomStates[roomId].isPlaying = true;
        io.to(roomId).emit("room-state", roomStates[roomId]);
    });

    socket.on("pause", ({ roomId }) => {
        if (!roomStates[roomId]) return;
        if (!hasControl(roomId, socket.id)) return; // Check control

        roomStates[roomId].isPlaying = false;
        io.to(roomId).emit("room-state", roomStates[roomId]);
    });

    socket.on("seek", ({ roomId, time }) => {
        if (!roomStates[roomId]) return;
        if (!hasControl(roomId, socket.id)) return; // Check control

        roomStates[roomId].playbackTime = time;
        io.to(roomId).emit("room-state", roomStates[roomId]);
    });

    // Transfer control to another user
    socket.on("transfer-control", ({ roomId, targetUserId }) => {
        const room = roomStates[roomId];
        if (!room) return;

        const currentUser = room.users.find(u => u.id === socket.id);
        const targetUser = room.users.find(u => u.id === targetUserId);

        // Only host or current controller can transfer control
        if (!currentUser || (!currentUser.isHost && !currentUser.hasControl)) return;
        if (!targetUser) return;

        // Remove control from all users and give to target
        room.users.forEach(u => u.hasControl = false);
        targetUser.hasControl = true;

        // Broadcast updated user list
        io.to(roomId).emit("update-users", room.users);

        // System message
        io.to(roomId).emit("receive-message", {
            id: Date.now(),
            user: "Sistem",
            text: `${currentUser.username}, kontrolü ${targetUser.username} kullanıcısına verdi.`,
            time: Date.now(),
            isSystem: true
        });
    });

    // Kick user from room (only host can do this)
    socket.on("kick-user", ({ roomId, targetUserId }) => {
        const room = roomStates[roomId];
        if (!room) return;

        const currentUser = room.users.find(u => u.id === socket.id);
        if (!currentUser || !currentUser.isHost) return; // Only host can kick

        const targetUserIndex = room.users.findIndex(u => u.id === targetUserId);
        if (targetUserIndex === -1) return;

        const targetUser = room.users[targetUserIndex];
        if (targetUser.isHost) return; // Cannot kick the host

        // Remove user from room
        room.users.splice(targetUserIndex, 1);

        // Notify the kicked user
        io.to(targetUserId).emit("kicked");

        // Make them leave the socket room
        const targetSocket = io.sockets.sockets.get(targetUserId);
        if (targetSocket) {
            targetSocket.leave(roomId);
        }

        // Broadcast updated user list
        io.to(roomId).emit("update-users", room.users);

        // System message
        io.to(roomId).emit("receive-message", {
            id: Date.now(),
            user: "Sistem",
            text: `${targetUser.username} odadan atıldı.`,
            time: Date.now(),
            isSystem: true
        });
    });

    socket.on("sync-response", ({ roomId, time, isPlaying, requesterId }) => {
        if (!roomStates[roomId]) return;

        // Update server state with accurate data from host
        roomStates[roomId].playbackTime = time;
        roomStates[roomId].isPlaying = isPlaying;

        // If specific requester provided, send updated state to them
        if (requesterId) {
            io.to(requesterId).emit("room-state", roomStates[roomId]);
        }
    });

    // Handle Disconnect
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);

        // Find user's room and remove them
        for (const roomId in roomStates) {
            const room = roomStates[roomId];
            const userIndex = room.users.findIndex(u => u.id === socket.id);

            if (userIndex !== -1) {
                const user = room.users[userIndex];
                const wasController = user.hasControl;
                room.users.splice(userIndex, 1);

                // If disconnected user had control, give it to host
                if (wasController && room.users.length > 0) {
                    const host = room.users.find(u => u.isHost);
                    if (host) {
                        host.hasControl = true;
                    } else {
                        room.users[0].hasControl = true;
                    }
                }

                io.to(roomId).emit("update-users", room.users);
                io.to(roomId).emit("receive-message", {
                    id: Date.now(),
                    user: "Sistem",
                    text: `${user.username} odadan ayrıldı.`,
                    time: Date.now(),
                    isSystem: true
                });

                // If room is empty, delete it (optional)
                if (room.users.length === 0) {
                    delete roomStates[roomId];
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

