import { Server } from "socket.io";
import {createServer} from "http";
import express from "express";
import { initialiseCollaborationSockets } from "./sockets/handlers";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();
const httpServer = createServer(app);
const port = process.env.COLLAB_SVC_PORT ?? 4004
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(express.json());
app.use(errorMiddleware);

initialiseCollaborationSockets(io);

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
})