import * as Y from 'yjs'
import { WebSocket } from 'ws'

interface Room {
    roomId: string
    code: Y.Doc
    connectedClients: Set<WebSocket>
}

export { Room }