import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer, IncomingMessage } from 'http'
import { Room } from '../models/types'
import logger from '../utils/logger'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { WebSocket } from 'ws'
import { router as submitCodeRouter } from '../submit-code/submitCodeRouter'
import { createRoomId } from '../utils/utils'
import { connect } from 'mongoose'

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())
app.use(submitCodeRouter)

const PORT = process.env.PORT
const server = createServer(app)
const wss = new WebSocket.Server({ server })

const rooms = new Map<string, Room>()

app.post('/create-room', async (req: any, res: any) => {
    const { userId1, userId2 } = req.body
    const roomId = createRoomId(userId1, userId2)

    if (rooms.has(roomId)) {
        return res.status(400).json({ message: 'Room already exists' })
    }

    const yDoc = new Y.Doc()
    rooms.set(roomId, {
        roomId,
        code: yDoc,
        connectedClients: new Set<WebSocket>(),
    })
    
    return res.status(200).json({ roomId })
})

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => { 
    const roomId = 'dummy'
    const room = rooms.get(roomId)

    if (!room) {
        ws.close()
        return
    }

    room.connectedClients.add(ws)

    const provider = new WebsocketProvider(
        `ws://localhost:${PORT}`,
        roomId,
        room.code,
    )
    
    // broadcast code changes to all connected clients
    room.code.on('update', (update) => {
        room.connectedClients.forEach((client) => {
            if (client !== ws) {
                client.send(update)
            }
        })
    })

    ws.on('close', () => {
        room.connectedClients.delete(ws)
        if (room.connectedClients.size === 0) {
            rooms.delete(roomId)
        }

        provider.destroy()
    })
})

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
