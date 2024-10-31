const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
//@ts-ignore
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;


/**
 * Server INITIALIZATION and CONFIGURATION
 * CORS configuration
 * Request body parsing
 */
const app = express();
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
app.use(express.json());

/**
 * Create an HTTP server
 */
const httpServer = createServer(app);

/**
 * Create a WebSocket server
 */
const wss = new WebSocketServer({ server: httpServer });

function onError(error) {
  console.log("Server error:", error);
}

function onListening() {
  console.log(`Listening on port 4444`);
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * On connection, use the utility file provided by y-websocket
 */
wss.on('connection', (ws, req) => {
  console.log("wss:connection");
  setupWSConnection(ws, req);
});

// Specify a port and start listening
const PORT = process.env.PORT || 4444; // Use 1234 or any other port you prefer
httpServer.listen(PORT);
