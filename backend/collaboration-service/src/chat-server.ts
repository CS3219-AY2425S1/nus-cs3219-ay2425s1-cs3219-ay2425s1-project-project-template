import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, '../public')))

export interface IMessage {
    text: string
    name: string
    id: string
    socketId: string
    roomId: string
    image?: string
}

// room id -> socket[]
let roomUsers: Record<string, Record<string, Socket>> = {}

io.on('connection', (socket: Socket) => {
    io.emit('users_response', roomUsers)

    socket.on('join_room', (roomId) => {
        socket.join(roomId)
        roomUsers = {
            ...roomUsers,
            [roomId]: { ...(roomUsers[roomId] ?? {}), ...{ [socket.id]: Socket } },
        }
        io.emit('users_response', roomUsers)
    })

    socket.on('send_message', (data: IMessage) => {
        Object.values(roomUsers[data.roomId]).forEach((s) => s.emit('receive_message', data))
    })

    socket.on('disconnect', () => {
        for (const [roomId, users] of Object.entries(roomUsers)) {
            if (Object.keys(users).includes(socket.id)) {
                delete roomUsers[roomId][socket.id]
                Object.values(roomUsers[roomId]).forEach((s) =>
                    s.emit('receive_message', {
                        text: 'A user left the room.',
                        socketId: 'kurakani',
                        roomId: roomId,
                    })
                )
            }
        }
        io.emit('users_response', roomUsers)
    })
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

const PORT = 3001

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
