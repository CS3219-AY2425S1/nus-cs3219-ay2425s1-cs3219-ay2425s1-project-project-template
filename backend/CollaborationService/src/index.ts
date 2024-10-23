import { Server } from "socket.io";
import {createServer} from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})


httpServer.listen(3000, () => {
    console.log(`Listening on port 3000`);
})