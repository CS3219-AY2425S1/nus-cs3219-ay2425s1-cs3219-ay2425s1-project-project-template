import * as Y from 'yjs'
import { WebSocket } from 'ws'
import { Awareness } from 'y-protocols/awareness'

interface Room {
    roomId: string;
    userIds: string[];
    code: Y.Doc;
    connectedClients: Set<WebSocket>;
    awareness: Awareness;
}

export { Room }