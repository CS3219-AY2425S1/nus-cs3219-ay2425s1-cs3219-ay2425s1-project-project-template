import 'dotenv/config'
import http, { Server } from 'http'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'
// @ts-expect-error - Yjs is not typed
import { setupWSConnection } from 'y-websocket/bin/utils'
import WebSocket from 'ws'

const server: Server = http.createServer(index)
const wss = new WebSocket.Server({ noServer: true })

server.on('upgrade', (request, socket, head) => {
    const token = request.headers['sec-websocket-protocol']
    if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
    }
    logger.info(`[WS] Token: ${token}`)
    const user = {
        id: '1',
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, user)
    })
})

wss.on('connection', (ws, req, user) => {
    const docName = req.url.slice(1)
    setupWSConnection(ws, req, { docName })
    logger.info(`User ${user.id} connected to document: ${docName}`)
    ws.on('close', () => {
        logger.info(`User ${user.id} disconnected from document: ${docName}`)
    })
})

server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})

connectToDatabase(config.DB_URL)
