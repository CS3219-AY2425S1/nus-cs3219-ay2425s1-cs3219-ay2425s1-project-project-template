import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { matchingRoutes } from './routes/matching-routes';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = process.env.PORT || 3000;

// Middleware for authenticating JWT
// app.use(authMiddleware);

// Middleware for JSON parsing
app.use(express.json());

// Apply routes
app.use('/api', matchingRoutes);

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        // Handle removing user from search pool on disconnect
    });

    // You can add more event listeners here for matching
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
