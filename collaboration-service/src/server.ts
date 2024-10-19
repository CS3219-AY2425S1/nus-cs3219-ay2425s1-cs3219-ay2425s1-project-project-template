import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { validateSocketJWT } from './middleware/jwt-validation';
import { handleEditorChanges } from './utils/editor-handler';
import router from './routes/session-routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/session", router)

mongoose
    .connect(process.env.MONGODB_URI as string, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB', err));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        credentials: true
    }
});

//io.use(validateSocketJWT);

handleEditorChanges(io);

export { server };

if (require.main === module) {
    dotenv.config();
    const PORT = 8001;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

}