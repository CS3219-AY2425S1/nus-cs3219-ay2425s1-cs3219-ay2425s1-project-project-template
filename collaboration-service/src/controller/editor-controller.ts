import { Server, Socket } from "socket.io";
import Session from '../model/session-model';
import * as Y from 'yjs';

//socket user mapping
const socketUserMap: { [key: string]: string } = {};
const userRoomMap: { [key: string]: string } = {};
export const roomDocumentMap: { [key: string]: Y.Doc } = {};

// Code execution results should show on both ends
// Store ydoc in memory instead of db
// check for session termination
// TODO

export async function initialize(socket: Socket, io: Server) {

    const { userId } = socket.data;
    if (userId in socketUserMap) {
        console.log('User already connected:', userId);
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
            console.error('No active session found for user', userId);
            socket.emit('error', 'No active session found');
            socket.disconnect(true);
            return;
        }

        userRoomMap[userId] = session.session_id;

        const questionDescription = session.questionDescription;
        const questionTemplateCode = session.questionTemplateCode;
        const questionTestcases = session.questionTestcases;

        if (!roomDocumentMap[session.session_id]) {
            console.warn(`YDoc not found for session ${session.session_id}. Did a crash happen? Creating new YDoc with template code`);
            const yDoc = new Y.Doc();
            Y.applyUpdate(yDoc, new Uint8Array(session.yDoc));
            roomDocumentMap[session.session_id] = yDoc;
        }

        const yDocUpdate = Y.encodeStateAsUpdate(roomDocumentMap[session.session_id]);

        const roomId = session.session_id; // Use session ID as room ID

        const roomSockets = await io.sockets.adapter.rooms.get(roomId);
        const numOfUsersInRoom = roomSockets ? roomSockets.size : 0;

        // Join the socket to the room
        socket.join(roomId);

        console.log(`User ${userId} joined session ${roomId}`);

        // Emit initial data to the user after they join the room
        socket.emit('initialData', {
            message: 'You have joined the session!',
            sessionData: {
                questionDescription,
                questionTemplateCode,
                questionTestcases,
                yDocUpdate,
                partnerJoined: numOfUsersInRoom > 1
            },
        });

        // Notify others in the room
        socket.to(roomId).emit('userJoined', { userId, message: 'Another user has joined the session!' });

    } catch (err) {
        console.error('Error finding session:', err);
        socket.emit('error', 'An error occurred while finding the session');
        socket.disconnect(true);
    }
}

export function handleUpdateContent(socket: Socket, io: Server) {
    socket.on('update', (update) => {
        // console.log('Received update:', update);
        const yDocUpdate = update;
        const roomId = userRoomMap[socket.data.userId];

        io.to(roomId).emit('updateContent', yDocUpdate);

        // Apply the update to the Y.Doc in local memory
        if (roomDocumentMap[roomId]) {
            Y.applyUpdate(roomDocumentMap[roomId], yDocUpdate);
        }
    });
}

export function handleSelectLanguage(socket: Socket, io: Server) {
    socket.on('selectLanguage', (language) => {
        const roomId = userRoomMap[socket.data.userId];
        socket.to(roomId).emit('updateLanguage', language);

    });
}

export function handleCodeExecution(socket: Socket, io: Server) {
    socket.on('codeExecution', (result) => {
        // console.log('Code execution result:', result);
        const roomId = userRoomMap[socket.data.userId];
        socket.to(roomId).emit('updateOutput', result);
    });
}


export function handleDisconnect(socket: Socket, io: Server) {
    socket.on('disconnect', () => {

        console.log('user disconnected');
        const roomId = userRoomMap[socket.data.userId];
        if (roomId) {
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            if (!roomSockets || roomSockets.size === 0) {
                // If no sockets left, mark the session as inactive
                console.log(`Room ${roomId} is empty. Marking session as inactive`);
                Session.findOneAndUpdate(
                    { session_id: roomId },
                    { active: false, yDoc: Buffer.from(Y.encodeStateAsUpdate(roomDocumentMap[roomId])) }
                )
                    .then((doc) => {
                        if (!doc) {
                            console.error('No session found with that id.');
                        }
                    })
                    .catch((err) => {
                        console.error('Error updating session:', err);
                    });

                    delete roomDocumentMap[roomId];
            } else {
                // Notify others in the room that the user has left
                socket.to(roomId).emit('userLeft', { userId: socket.data.userId, message: 'User has left the session' });
            }
        }
        if (userRoomMap[socket.data.userId]) {
            delete userRoomMap[socket.data.userId];
        }
        if (socketUserMap[socket.data.userId]) {
            delete socketUserMap[socket.data.userId];
        }
    });
}
