import { Server } from "socket.io";
import {createServer} from "http";
import express from "express";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { initialiseCommunicationHandlers } from "./socket/handler";

const app = express();
const httpServer = createServer(app);
const port = process.env.COMM_SVC_PORT ?? 4005
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(express.json());
app.use(errorMiddleware);

initialiseCommunicationHandlers(io);

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
})