import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { sendMatchingRequest } from '../producer/producer'
import { startConsumer } from '../consumer/consumer'
import logger from '../utils/logger'

dotenv.config({ path: './.env' })

const connectedClients = new Map<string, string>()

const io = new Server({
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {
    socket.on('login', (name) => {
        connectedClients.set(name, socket.id)
        logger.info(`User ${name} logged in with socket ${socket.id}`)
    })

    socket.on('requestMatch', async (data) => {
        const { name, difficulty, categories } = data
        logger.info(
            `User ${name} has requested for a match with difficulty ${difficulty} and categories ${categories}`,
        )
        sendMatchingRequest(data)
    })

    socket.on('disconnect', () => {
        for (const [name, id] of connectedClients.entries()) {
            if (id == socket.id) {
                connectedClients.delete(name)
                logger.info(`User ${name} disconnected`)
                break
            }
        }
    })
})

const port = parseInt(process.env.PORT || '3000', 10)

io.listen(port)
logger.info(`Server started on port ${port}`)
startConsumer(io, connectedClients)
