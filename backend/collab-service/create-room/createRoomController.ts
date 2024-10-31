import { Request, Response } from 'express';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { WebSocket } from 'ws';
import { createRoomId } from '../utils/utils';
import { rooms } from '../server/rooms';
import { Room } from '../models/types';
import logger from '../utils/logger';

const createRoom = async (req: Request, res: Response):Promise<any> => {
    const { userId1, userId2 } = req.body;

    

    if (!userId1 || !userId2) {
        return res.status(400).json({ message: 'User IDs are required' });
    }

    const roomId = createRoomId(userId1, userId2);
    logger.info(`Request to create room with ID ${roomId} received`)

    if (rooms.has(roomId)) {
        return res.status(400).json({ message: 'Room already exists', roomId });
    }

    const yDoc = new Y.Doc();
    const awareness = new Awareness(yDoc);

    const newRoom: Room = {
        roomId,
        userIds: [userId1, userId2],
        code: yDoc,
        connectedClients: new Set<WebSocket>(),
        awareness: awareness,
    };

    rooms.set(roomId, newRoom);

    return res.status(200).json({ roomId });
};

export {createRoom}