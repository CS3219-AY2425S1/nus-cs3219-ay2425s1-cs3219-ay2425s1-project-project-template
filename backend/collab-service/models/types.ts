import { Request } from 'express'
import { Types } from 'mongoose'
import * as Y from 'yjs'
import { WebSocket } from 'ws'
import { Awareness } from 'y-protocols/awareness'

interface Room {
    roomId: string;
    userIds: string[];
    language: string;
    code: Y.Doc;
    connectedClients: Set<WebSocket>;
    awareness: Awareness;
}

interface CreateMatchRequest extends Request {
    body: {
        collaborators: Types.ObjectId[];
        questionId: number;
    }
}

export { CreateMatchRequest, Room }