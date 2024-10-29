const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const WebSocketServer = require('ws').Server;
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));

app.use(express.json());

const httpServer = createServer(app);
const port = 8200;
const wss = new WebSocketServer({ server: httpServer });
httpServer.listen(port, () => {
    console.log(`Collab server listening at http://localhost:${port}`);
});
wss.on('connection', (ws, req) => {
  console.log("wss:connection");
  setupWSConnection(ws, req);
});