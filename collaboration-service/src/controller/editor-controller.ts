import { Server, Socket } from "socket.io";
import Session from '../model/session-model';
import * as Y from 'yjs';

//socket user mapping
const socketUserMap: { [key: string]: string } = {};

export async function initialize(socket: Socket, io: Server) {

    const { userId } = socket.data;
    if (userId in socketUserMap) {
        socket.emit('error', 'User already connected');
        socket.disconnect(true);
        return;
    }

    socketUserMap[userId] = socket.id;

    try {
        // Find the session that the user is part of
        const session = await Session.findOne({
            participants: { $in: [userId] }, // Check if userId is in participants array
            active: true
        });


        if (!session) {
            socket.emit('error', 'No active session found');
            socket.disconnect(true);
            return;
        }

        const questionDescription = session.questionDescription;
        const questionTemplateCode = session.questionTemplateCode;
        const questionTestcases = session.questionTestcases;
        const yDocBuffer = session.yDoc;
        const yDocUpdate = new Uint8Array(yDocBuffer);

        const roomId = session.session_id; // Use session ID as room ID

        const roomSockets = await io.sockets.adapter.rooms.get(roomId);
        const numOfUsersInRoom = roomSockets ? roomSockets.size : 0;

        // Join the socket to the room
        socket.join(roomId);

        // Emit initial data to the user after they join the room
        socket.emit('initialData', {
            message: 'You have joined the session!',
            sessionData: {
                questionDescription,
                questionTemplateCode,
                questionTestcases,
                yDocUpdate
            },
            partnerJoined: numOfUsersInRoom > 1
        });

        // Notify others in the room
        socket.to(roomId).emit('userJoined', { userId, message: 'Another user has joined the session!' });

    } catch (err) {
        console.error('Error finding session:', err);
        socket.emit('error', 'An error occurred while finding the session');
    }
}

export function handleUpdateContent(socket: Socket, io: Server) {
    socket.on('update', (update) => {
        const yDocUpdate = update;
        const roomId = Object.keys(socket.rooms)[1]; // Get the room ID
        socket.to(roomId).emit('updateContent', yDocUpdate);

        // Retrieve ydoc from the database and apply the update
        // NOT SURE IF THIS WORKS - REQUIRES TESTING
        Session.findOne({ session_id: roomId }, (err: any, doc: any) => {
            if (err) {
                console.error('Error finding session:', err);
            } else {
                doc.yDoc = Y.applyUpdate(doc.yDoc, yDocUpdate);
                doc.save((err: any) => {
                    if (err) {
                        console.error('Error saving session:', err);
                    }
                });
            }
        });
    });
}

export function handleSelectLanguage(socket: Socket, io: Server) {
    socket.on('selectLanguage', (language) => {
        const roomId = Object.keys(socket.rooms)[1]; // Get the room ID
        socket.to(roomId).emit('updateLanguage', language);
    });
}

export function handleCodeExecution(socket: Socket, io: Server) {
    socket.on('codeExecution', (result) => {
        const roomId = Object.keys(socket.rooms)[1]; // Get the room ID
        socket.to(roomId).emit('updateOutput', result);
    });
}

export function handleDisconnect(socket: Socket, io: Server) {
    socket.on('disconnect', () => {
        delete socketUserMap[socket.data.userId];
        const rooms = Object.keys(socket.rooms); // Get all rooms this socket was in
        rooms.forEach((room) => {
            // Check if the room has any sockets left
            const roomSockets = io.sockets.adapter.rooms.get(room);
            if (!roomSockets || roomSockets.size === 0) {
                // If no sockets left, mark the session as inactive
                console.log(`Room ${room} is empty. Marking session as inactive`);
                Session.findOneAndUpdate({ session_id: room }, { active: false }, (err: any, doc: any) => {
                    if (err) {
                        console.error('Error updating session:', err);
                    }
                });
            } else {
                // Notify others in the room that the user has left
                socket.to(room).emit('userLeft', { userId: socket.data.userId, message: 'User has left the session' });
            }
        });
        console.log('user disconnected');
    });
}
