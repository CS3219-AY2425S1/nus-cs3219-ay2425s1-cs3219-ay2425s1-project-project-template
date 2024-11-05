const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
const handleSocketEvents = require('./socketHandlers');

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

handleSocketEvents(io);

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