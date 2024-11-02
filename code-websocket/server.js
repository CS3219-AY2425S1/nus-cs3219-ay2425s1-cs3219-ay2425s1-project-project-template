const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8081 });

server.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (message) => {
        // Ensure message is in string format
        const stringMessage = typeof message === 'string' ? message : message.toString();
        console.log('Received message:', stringMessage);

        // Broadcast the message to all clients except the sender
        server.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(stringMessage); // Send as a string
            }
        });
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8081');
