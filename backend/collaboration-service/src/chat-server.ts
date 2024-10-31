import express, { NextFunction, Request, Response } from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'

const app = express()

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
app.use(helmet())
app.use((request: Request, response: Response, next: NextFunction) => {
    response.header('Access-Control-Allow-Origin', '*') // "*" -> Allow all links to access

    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    // Browsers usually send this before PUT or POST Requests
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH')
        response.status(200).send()
        return
    }

    // Continue Route Processing
    next()
})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: '*',
    },
})

export interface IMessage {
    text: string
    name: string
    email: string
    socketId: string
    roomId: string
    time: string
}

// room id -> socket[]
let roomUsers: Record<string, string[]> = {}
const sockets: Record<string, Socket> = {}
io.on('connection', (socket: Socket) => {
    sockets[socket.id] = socket
    io.emit('users_response', roomUsers)

    socket.on('join_room', (roomId) => {
        socket.join(roomId)
        roomUsers = {
            ...roomUsers,
            [roomId]: [...(roomUsers[roomId] ?? []), socket.id],
        }
        io.emit('users_response', roomUsers)
    })

    socket.on('send_message', (data: IMessage) => {
        Object.values(roomUsers[data.roomId]).forEach((s) => {
            if (sockets[s].connected) {
                sockets[s].emit('receive_message', data)
            }
        })
    })

    socket.on('disconnect', () => {
        for (const [roomId, users] of Object.entries(roomUsers)) {
            if (Object.keys(users).includes(socket.id)) {
                delete roomUsers[roomId][socket.id]
                const msg: IMessage = {
                    text: 'A user left the room.',
                    socketId: 'kurakani',
                    roomId: roomId,
                    time: new Date().toString(),
                    name: '',
                    email: '',
                }
                Object.values(roomUsers[roomId]).forEach((s) => {
                    console.log('SEdnign message to socket: ', s, sockets[s])
                    if (sockets[s].connected) {
                        sockets[s].emit('receive_message', msg)
                    }
                })
            }
        }
        io.emit('users_response', roomUsers)
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

const PORT = 3010

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
