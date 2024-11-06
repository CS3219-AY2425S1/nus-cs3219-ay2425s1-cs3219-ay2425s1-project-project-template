import roomService from '../services/roomService.js';
import clientInstance from '../models/client-model.js';
const { getRoom, updateCursorPosition, updateContent, updateLanguage } = roomService;

function createSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const userId = socket.handshake.query.userId;

        clientInstance.addClient(userId, socket.id);

        socket.on('joinRoom', ({ roomId }) => {
            console.log(`User ${socket.id} attempting to join room: ${roomId}`);
            socket.join(roomId);
            // const room = getRoom(roomId);
            // if (room) {
            //     console.log(`User ${socket.id} joined room: ${roomId}`);
            // } else {
            //     console.error(`Room ${roomId} not found for user ${socket.id}`);
            //     //socket.emit('error', { message: 'Room not found' });
            // }
        });

        socket.on('chat message', ({ roomId, msg }) => {
            console.log(`User ${socket.id} editing document in room: ${roomId}`);
            const room = getRoom(roomId);
            // if (room) {
            //     //updateContent(roomId, content);
            //     console.log(`Updated chat content in room ${roomId}. Broadcasting to other users.`);
            //     socket.to(roomId).emit('chat message', { msg });
            // } else {
            //     console.error(`Failed to update chat for room ${roomId} by user ${socket.id}. Room or content may be missing.`);
            // }
            console.log(`Updated chat content with msg: ${msg} in room ${roomId}. Broadcasting to other users.`);
            socket.to(roomId).emit('chat message', { msg });
        });



        socket.on('custom_disconnect', ({ roomId, username }) => {
            console.log('User disconnected:', socket.id);

            const userId = clientInstance.getUserIdBySocketId(socket.id);

            if (userId) {
                clientInstance.removeClient(userId);
                console.log(`Removed client with userId: ${userId} after disconnect.`);
            } else {
                console.error(`Could not find userId for disconnected socket: ${socket.id}`);
            }

            socket.to(roomId).emit('partner_disconnect', { username });
        });
        // partner username event
        socket.on('first_username', ({ roomId, username }) => {
            console.log(`Received first_username event from user: ${username}`);
            socket.to(roomId).emit('first_username', { username });
        });

        socket.on('second_username', ({ roomId, username }) => {
            console.log(`Received first_username event from user: ${username}`);
            socket.to(roomId).emit('second_username', { username });
        });
    });
}

export default { 
    createSocket 
};
