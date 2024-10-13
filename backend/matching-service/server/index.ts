import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { sendMatchingRequest } from '../producer/producer'
import { startConsumer } from '../consumer/consumer'
import logger from '../utils/logger'
// import { connect } from 'amqplib'

dotenv.config({ path: './.env' })

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

app.use(express.json())
app.use(cors())

const connectedClients = new Map()

io.on('connection', (socket) => {
    socket.on('register', (name) => {
        connectedClients.set(name, socket.id)
        logger.info(`User ${name} registered with socket ${socket.id}`)
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

app.post('/match', async (req: Request, res: Response) => {
    const { name, difficulty, categories } = req.body
    logger.info(
        `User ${name} has requested for a match with difficulty ${difficulty} and categories ${categories}`,
    )

    const data = { name, difficulty, categories }

    await sendMatchingRequest(data)
    res.status(200).json({ message: 'Match request sent successfully' })
})

const port = process.env.PORT

server.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
    startConsumer(io, connectedClients)
})

export { io, connectedClients }