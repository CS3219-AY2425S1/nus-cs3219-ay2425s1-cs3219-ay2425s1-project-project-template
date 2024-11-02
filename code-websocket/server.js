const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8081 });

// Store the code for each session ID
const sessionData = {};

server.on('connection', (socket, request) => {
    const sessionID = request.url.split('/').pop();

    // Initialize session data if it doesn't exist
    if (!sessionData[sessionID]) {
        sessionData[sessionID] = { code: '' };
    }

    console.log(`Client connected to session: ${sessionID}`);

    // Send the current code to the newly connected client
    socket.send(JSON.stringify({ type: 'initialCode', content: sessionData[sessionID].code }));

    // Handle incoming messages
    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(`Received message from session ${sessionID}:`, parsedMessage);

        if (parsedMessage.type === 'code') {
            // Update the stored code for this session
            sessionData[sessionID].code = parsedMessage.content;

            // Broadcast the updated code to all clients in the session
            server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'code', content: parsedMessage.content }));
                }
            });
        }
    });

    // Handle client disconnection
    socket.on('close', (code, reason) => {
        console.log(`Client disconnected from session: ${sessionID}, code: ${code}, reason: ${reason}`);
        if (server.clients.size === 0) {
            console.log(`All clients disconnected from session: ${sessionID}`);
        }
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8081');
