import { Server, Socket } from "socket.io";
import Session from '../model/session-model';
import * as Y from 'yjs';
import { addUpdateToYDocInRedis, deleteYDocFromRedis, getLanguageFromRedis, getYDocFromRedis, setLanguageInRedis } from "../utils/redis-helper";

//socket user mapping
const socketUserMap: { [key: string]: string } = {};
const userRoomMap: { [key: string]: string } = {};

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

        // Check if partner is already in the room
        const roomSockets = await io.sockets.adapter.rooms.get(session.session_id);
        const numOfUsersInRoom = roomSockets ? roomSockets.size : 0;


        const yDoc = await getYDocFromRedis(session.session_id);

        let yDocUpdate: Uint8Array;

        if (!yDoc) {
            console.warn(`YDoc not found for session ${session.session_id}. Creating new YDoc with template code`);
            const newYDoc = new Y.Doc();
            Y.applyUpdate(newYDoc, new Uint8Array(session.yDoc));
            addUpdateToYDocInRedis(session.session_id, Y.encodeStateAsUpdate(newYDoc));
            yDocUpdate = Y.encodeStateAsUpdate(newYDoc);
        } else {
            yDocUpdate = Y.encodeStateAsUpdate(yDoc);
        }

        const selectedLanguage = await getLanguageFromRedis(session.session_id);

        const roomId = session.session_id; // Use session ID as room ID

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
                selectedLanguage,
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

        // Add Update to YDoc in Redis
        addUpdateToYDocInRedis(roomId, yDocUpdate);
    });
}

export function handleSelectLanguage(socket: Socket, io: Server) {
    socket.on('selectLanguage', (language) => {
        const roomId = userRoomMap[socket.data.userId];
        socket.to(roomId).emit('updateLanguage', language);
        // Store language in Redis
        setLanguageInRedis(roomId, language);
    });
}

export function handleCodeExecution(socket: Socket, io: Server) {
    socket.on('codeExecution', (result) => {
        // console.log('Code execution result:', result);
        const roomId = userRoomMap[socket.data.userId];
        socket.to(roomId).emit('updateOutput', result);
    });
}


export async function handleDisconnect(socket: Socket, io: Server) {
    socket.on('disconnect', async () => {

        console.log('user disconnected');
        const roomId = userRoomMap[socket.data.userId];
        if (roomId) {
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            if (!roomSockets || roomSockets.size === 0) {
                // If no sockets left, mark the session as inactive
                console.log(`Room ${roomId} is empty. Marking session as inactive`);

                // Get the YDoc from redis
                const yDoc = await getYDocFromRedis(roomId);

                if (yDoc) {
                    Session.findOneAndUpdate(
                        { session_id: roomId },
                        { active: false, yDoc: Buffer.from(Y.encodeStateAsUpdate(yDoc)) }
                    )
                        .then((doc) => {
                            if (!doc) {
                                console.error('No session found with that id.');
                            }
                        })
                        .catch((err) => {
                            console.error('Error updating session:', err);
                        });
                } else {
                    console.error(`YDoc not found for session ${roomId}. Cannot update session.`);
                }

                // Delete the YDoc from Redis
                deleteYDocFromRedis(roomId);

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
