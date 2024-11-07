import express, { json } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import matchRoutes from './routes/matchRoutes.js';
import matchController from './controllers/matchController.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const frontendURL = process.env.frontend_url || "http://localhost:8080";
const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

app.use(json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    console.log('Access-Control-Request-Method:', req.headers['access-control-request-method']);
    console.log('Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
    next();
  });
app.use('/matcher', matchRoutes);

// Start the server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    matchController.initializeQueueProcessing(io);
});
