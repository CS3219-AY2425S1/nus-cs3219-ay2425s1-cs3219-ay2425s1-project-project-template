import Room from '../models/room-model.js';

const rooms = {}; 

async function createRoom(roomId, user1, user2) {
    
    rooms[roomId] = new Room(roomId, user1, user2);
    return rooms[roomId];
}

function getRoom(roomId) {
    return rooms[roomId];
}

function updateContent(roomId, content) {
    rooms[roomId].updateContent(content);
}

export default {
    createRoom,
    getRoom,
    updateContent,
}