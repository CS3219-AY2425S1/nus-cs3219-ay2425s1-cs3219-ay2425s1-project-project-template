// pages/api/socket.js

import { WebSocketServer } from 'ws';

export default function handler(req: any, res: any) {
    if (!res.socket.server.wss) {
        // Create a new WebSocket server if it doesn’t exist
        const wss = new WebSocketServer({ server: res.socket.server });

        wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                // Broadcast the message to all connected clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            });
        });

        wss.on('message', (data) => {
            const { type, code } = JSON.parse(data);
            if (type === 'codeChange') {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'codeUpdate', code }));
                    }
                });
            }
        });

        res.socket.server.wss = wss;
    }
    res.end();
}
