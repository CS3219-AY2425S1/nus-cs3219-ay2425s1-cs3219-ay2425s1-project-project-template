import { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "../utils/logger";
import QueueService from "../QueueService/QueueService";

export default function initialiseWebsocket(app: Application, queueService: QueueService) {
    const WEBSOCKET_PORT: number = 3001;
    const RESPONSE_QUEUE: string = "response";
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Enable cors for frontend
            methods: ["GET", "POST"]
        }
    });
    queueService.consumeResponses(io);

    io.on("connection", (socket) => {
        logger.info(`Client connected: ${socket.id}`);
        
        // Join a room based on match ID (sent by client)
        socket.on("joinMatchResponseRoom", (matchId) => {
            socket.join(matchId.matchId);
            logger.info(`Client joined room: ${matchId.matchId}`);
        });

        socket.on("matchRequestResponse", (matchId, data) => {
            io.to(matchId).emit("receiveMatchResponse", data);
            logger.info(`Match resopnse tsent to room: ${matchId}`);

            io.to(matchId).socketsLeave(matchId); // Might cause bugs??
        })

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });
    server.listen(WEBSOCKET_PORT);
}