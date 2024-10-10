import { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "../utils/logger";

export default function initialiseWebsocket(app: Application) {
    const WEBSOCKET_PORT: number = 3001;
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Enable cors for frontend
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        logger.info(`Client connected: ${socket.id}`);
        
        // Join a room based on match ID (sent by client)
        socket.on("joinMatchResponseRoom", (matchId) => {
            socket.join(matchId);
            logger.info(`Client joined room: ${matchId}`);
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