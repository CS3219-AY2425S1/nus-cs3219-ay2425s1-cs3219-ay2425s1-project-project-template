import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import logger from '../utils/logger'
import { router as submitCodeRouter } from '../submit-code/submitCodeRouter'

dotenv.config({ path: './.env' })

const app = express()
app.use(cors())
app.use(express.json())

app.use(submitCodeRouter)

const server = createServer(app)
const io: Server = new Server(server)

io.on('connection', (socket: Socket) => {
    logger.info(`New client connected: ${socket.id}`, { service: 'collab-service', timestamp: new Date().toISOString() })
})

const port = process.env.PORT
server.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})