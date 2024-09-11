import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { validateSocketJWT } from './middleware/jwt-validation';
import { registerEventHandlers } from './routes/socket-routes';
import dotenv from 'dotenv';

dotenv.config();

// Create the express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust this based on your allowed origins
    },
});

// Middleware for parsing JSON
app.use(express.json());

// Socket.io connection handler with JWT validation
io.use(validateSocketJWT);
io.on('connection', (socket) => {
    console.log(`User ${socket.data.userId} connected via socket ${socket.id}`);
    registerEventHandlers(socket, io);
})

export { server };

if (require.main === module) {
    // Start the server
    const PORT = process.env.PORT || 8002;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
