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

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())
app.use(submitCodeRouter)

const PORT = process.env.PORT
const server = createServer(app)
const wss = new WebSocket.Server({ server })
const yDocMap = new Map<string, Y.Doc>()

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const roomName: string = req.url
        ? (parse(req.url, true).query.roomName as string)
        : ''

    if (!yDocMap.has(roomName)) {
        yDocMap.set(roomName, new Y.Doc())
    }

    if (!yDocMap.has(roomName)) {
        logger.error(`Code file for room ${roomName} not found`)
    }

    const sharedDoc = yDocMap.get(roomName) as Y.Doc

    const provider = new WebsocketProvider(
        `ws://localhost:${PORT}`,
        roomName,
        sharedDoc,
    )

    sharedDoc.on('update', (update) => {})

    ws.on('close', () => {
        logger.info(`Connection closed for room ${roomName}`)
        provider.destroy()
    })
})

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
