const { addContinueVote } = require('./sessionManager');
const { addUserToRoom, removeUserFromRoom, getRoomUserCount, cleanupRoom } = require('./roomManager');

function handleSocketEvents(io) {
    
    const disconnectTimeouts = new Map(); // Store timeout references for each user

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        // Store the username when the user is added
        socket.on('add-user', (username) => {
            console.log(`${username} joined`);
            socket.username = username;

             // Clear any existing disconnect timeout for this user if they reconnect quickly
            if (disconnectTimeouts.has(username)) {
                clearTimeout(disconnectTimeouts.get(username));
                disconnectTimeouts.delete(username);
            }
        });

        // Join a specific room and store roomId on socket instance
        socket.on('join-room', (roomId) => {
            
            socket.roomId = roomId;
            socket.join(roomId);
            addUserToRoom(roomId, socket.username);
            console.log(socket.username + ' joined room: ' + roomId);

            // Check if both users have joined
            if (getRoomUserCount(roomId) === 2) {
                io.to(roomId).emit('start-timer');
            }
        });
        
        // Handle disconnection with grace period
        socket.on('disconnect', () => {
            console.log('Socket.IO client disconnected');
            if (socket.username && socket.roomId) {
                // Start grace period for reconnection
                const timeoutId = setTimeout(() => {
                    console.log(`${socket.username} left room ${socket.roomId} permanently`);
                    socket.to(socket.roomId).emit('user-left'); // Emit only to the specific room

                    // Remove user from room and check if room is empty
                    const roomIsEmpty = removeUserFromRoom(socket.roomId, socket.username);
                    disconnectTimeouts.delete(socket.username);

                    // If room is empty, clean up the room
                    if (roomIsEmpty) {
                        cleanupRoom(socket.roomId);
                    }
                    
                }, 10000); // 10 seconds grace period
    
                disconnectTimeouts.set(socket.username, timeoutId);
            }
        });

        // Clear grace period timeout if user reconnects
        socket.on('reconnect', () => {
            const timeoutId = disconnectTimeouts.get(socket.username);
            if (timeoutId) clearTimeout(timeoutId);
        });

        // Listen for continue-session from client
        socket.on('continue-session', (roomId) => {
            addContinueVote(roomId, socket.username, io);
        });
    });
}

module.exports = handleSocketEvents;
