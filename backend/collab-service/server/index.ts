import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer, IncomingMessage } from 'http'
import { parse } from 'url'
import logger from '../utils/logger'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { WebSocket } from 'ws'
import { router as submitCodeRouter } from '../submit-code/submitCodeRouter'
import { connect } from 'mongoose'

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())
app.use(submitCodeRouter)

const PORT = process.env.PORT
const server = createServer(app)
const wss = new WebSocket.Server({ server })
const yDocMap = new Map<string, Y.Doc>()
const clientMap = new Map<string, Set<WebSocket>>()

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const roomName: string = req.url
        ? (parse(req.url, true).query.roomName as string)
        : ''

    if (!yDocMap.has(roomName)) {
        yDocMap.set(roomName, new Y.Doc())
    }

    if (!clientMap.has(roomName)) {
        clientMap.set(roomName, new Set<WebSocket>())
    }

    const sharedDoc = yDocMap.get(roomName) as Y.Doc
    const connectedClients = clientMap.get(roomName) as Set<WebSocket>
    connectedClients.add(ws)

    const provider = new WebsocketProvider(
        `ws://localhost:${PORT}`,
        roomName,
        sharedDoc,
    )

    sharedDoc.on('update', (update) => {
        connectedClients.forEach((client) => {
            if (client !== ws) {
                client.send(JSON.stringify(update))
            }
        })
    })

    ws.on('close', () => {
        connectedClients.delete(ws)

        if (connectedClients.size === 0) {
            clientMap.delete(roomName)
        }

        logger.info(`Connection closed for room ${roomName}`)
        provider.destroy()
    })
})

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
