import roomService from '../services/roomService.js';
const { getRoom, addMessage } = roomService;

function createSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const userId = socket.handshake.query.userId;


        socket.on('joinRoom', ({ roomId }) => {
            console.log(`User ${socket.id} attempting to join room: ${roomId}`);
            socket.join(roomId);
            const room = roomService.createRoom(roomId);
            socket.emit('load_room_content', { 
                messages: room.messages,
            });
        });

        socket.on('chat message', ({ roomId, msg, username }) => {
            console.log(`User ${socket.id} editing document in room: ${roomId}`);
            const room = getRoom(roomId);
            if (room) {
                const newMessage = addMessage(roomId, msg, username);
                console.log(`Updated chat content in room ${roomId}. Broadcasting to other users.`);
                socket.to(roomId).emit('chat message', { newMessage });
                // Emit to the client who sent the message
                socket.emit('chat message', { newMessage });
            } else {
                console.error(`Failed to update chat for room ${roomId} by user ${socket.id}. Room or content may be missing.`);
            }

        });


    });
}

export default { 
    createSocket 
};
