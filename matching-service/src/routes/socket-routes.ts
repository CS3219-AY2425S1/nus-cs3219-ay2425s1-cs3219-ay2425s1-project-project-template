import { Server, Socket } from "socket.io";
import { handleDisconnect, handleRegisterForMatching } from "../controller/socket-controller";

export function registerEventHandlers(socket: Socket, io: Server) {
    handleRegisterForMatching(socket, io);
    handleDisconnect(socket);
}

