const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8081 });

// Store the code for each session ID
const sessionData = {};
const activeUsers = {};
server.on('connection', (socket, request) => {
    const urlParts = request.url.split('/');
    const sessionID = urlParts.pop().split('?')[0];
    const userID = new URLSearchParams(request.url.split('?')[1]).get('userID');

    // Initialize session data if it doesn't exist
    if (!sessionData[sessionID]) {
        sessionData[sessionID] = { code: '' };
    }

    if (!activeUsers[sessionID]) {
        activeUsers[sessionID] = {};
    }

    activeUsers[sessionID][userID] = socket;
    console.log(`User ${userID} connected to session ${sessionID}`);

    broadcastToSession(sessionID, {
        type: 'userConnected',
        userID,
    });

    // Send the current code to the newly connected client
    socket.send(JSON.stringify({ type: 'initialCode', content: sessionData[sessionID].code }));

    // Handle incoming messages
    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(`Received message from user ${userID} in session ${sessionID}:`, parsedMessage);

        if (parsedMessage.type === 'code') {
            // Update the stored code for this session
            sessionData[sessionID].code = parsedMessage.content;

            // Broadcast the updated code to all clients in the same session
            broadcastToSession(sessionID, {
                type: 'code',
                content: parsedMessage.content
            }, socket);
        }
    });

    // Handle client disconnection
    socket.on('close', (code, reason) => {
        console.log(`User ${userID} disconnected from session ${sessionID}, code: ${code}, reason: ${reason}`);

        // Remove the user from the active users list
        delete activeUsers[sessionID][userID];

        // Log the remaining users in the session
        const remainingUsers = Object.keys(activeUsers[sessionID]);
        console.log(`Remaining users in session ${sessionID}: ${remainingUsers.length > 0 ? remainingUsers.join(', ') : 'None'}`);


        broadcastToSession(sessionID, {
            type: 'userDisconnected',
            userID,
        });

        if (remainingUsers.length === 0) {
            console.log(`All users disconnected from session ${sessionID}. Removing session data.`);

            // Remove the session data and active users entry for this session
            delete sessionData[sessionID];
            delete activeUsers[sessionID];
        }
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error(`Socket error for user ${userID} in session ${sessionID}:`, error);
    });


});


function broadcastToSession(sessionID, message, excludeSocket = null) {
    Object.values(activeUsers[sessionID]).forEach((clientSocket) => {
        if (clientSocket.readyState === WebSocket.OPEN && clientSocket !== excludeSocket) {
            clientSocket.send(JSON.stringify(message));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8081');