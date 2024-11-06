import Room from '../models/room-model.js';

const rooms = {}; 

function createRoom(roomId, user1, user2) {
    if (rooms[roomId]) {
        return rooms[roomId];
    }
    rooms[roomId] = new Room(roomId, user1, user2);
    return rooms[roomId];
}

function getRoom(roomId) {
    return rooms[roomId];
}

function addMessage(roomId, msg, username) {
    return rooms[roomId].addMessage(msg, username);
}

export default {
    createRoom,
    getRoom,
    addMessage,
}