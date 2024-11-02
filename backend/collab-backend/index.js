const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Port configurations
const socketIoPort = 8200;
const yjsPort = 8201;

// Server setup for Socket.IO on port 8200
const ioServer = createServer(app);
const io = new Server(ioServer, {
    path: "/socket.io",
    cors: { origin: 'http://localhost:3000' },
});

const disconnectTimeouts = new Map(); // Store timeout references for each user

io.on('connection', (socket) => {
    console.log('Socket.IO client connected');

    // Store the username when the user is added
    socket.on('add-user', (username) => {
        console.log(`${username} joined`);
        socket.username = username;

        // Clear any existing disconnect timeout for this user if they reconnect quickly
        if (disconnectTimeouts.has(username)) {
            clearTimeout(disconnectTimeouts.get(username));
            disconnectTimeouts.delete(username);
        }
    });

    // Join a specific room and store roomId on socket instance
    socket.on('join-room', (roomId) => {
        console.log(`${socket.username} joined room ${roomId}`);
        socket.join(roomId);
        socket.roomId = roomId; // Store roomId on socket for reference during disconnect
    });

    // Handle disconnection with grace period
    socket.on('disconnect', () => {
        console.log('Socket.IO client disconnected');
        if (socket.username && socket.roomId) {
            // Start grace period for reconnection
            const timeoutId = setTimeout(() => {
                console.log(`${socket.username} left room ${socket.roomId} permanently`);
                socket.to(socket.roomId).emit('user-left'); // Emit only to the specific room
                disconnectTimeouts.delete(socket.username);
            }, 10000); // 10 seconds grace period

            disconnectTimeouts.set(socket.username, timeoutId);
        }
    });

    // Clear grace period timeout if user reconnects
    socket.on('reconnect', () => {
        const timeoutId = disconnectTimeouts.get(socket.username);
        if (timeoutId) clearTimeout(timeoutId);
    });
});

ioServer.listen(socketIoPort, () => {
    console.log(`Socket.IO server listening at http://localhost:${socketIoPort}`);
});

// Server setup for y-websocket on port 8201
const yjsServer = createServer(app);
const wss = new WebSocket.Server({ noServer: true });

yjsServer.on('upgrade', (request, socket, head) => {
    if (request.url.startsWith('/yjs')) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', (ws, req) => {
    console.log("WebSocket client connected for y-websocket");
    setupWSConnection(ws, req);
});

yjsServer.listen(yjsPort, () => {
    console.log(`y-websocket server listening at http://localhost:${yjsPort}`);
});