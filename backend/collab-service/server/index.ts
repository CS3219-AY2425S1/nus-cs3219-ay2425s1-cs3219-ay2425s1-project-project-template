import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
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

const server = createServer(app)
const wss = new WebSocket.Server({ server })
const yDocMap = new Map()

wss.on('connection', (ws: WebSocket) => {
    const roomName = 'dummy'

    if (!yDocMap.has(roomName)) {
        yDocMap.set(roomName, new Y.Doc())
    }

    const sharedDoc = yDocMap.get(roomName)

    const provider = new WebsocketProvider(
        'ws://localhost:1234', // placeholder
        roomName,
        sharedDoc,
    )
})

const PORT = process.env.PORT

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
