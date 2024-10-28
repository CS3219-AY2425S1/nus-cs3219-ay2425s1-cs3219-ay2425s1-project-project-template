import { Server, Socket } from "socket.io";
import { handleCodeExecution, handleDisconnect, handleSelectLanguage, handleUpdateContent, handleTermination } from "../controller/editor-controller";

export function registerEventHandlers(socket: Socket, io: Server) {
    handleUpdateContent(socket, io);
    handleSelectLanguage(socket, io);
    handleCodeExecution(socket, io);
    handleTermination(socket, io);
    handleDisconnect(socket, io);
}
