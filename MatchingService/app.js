import express, { json } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import matchRoutes from './routes/matchRoutes.js';
import matchController from './controllers/matchController.js';
import cors from 'cors';

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

app.use(cors());
app.use(json());
app.use('/matcher', matchRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    matchController.initializeQueueProcessing(io);
});
