import { Server, Socket } from "socket.io";
import { verifyRoomJoinPermission, verifyInRoomPermission, handleConnection } from "../controllers/collaborationController";

export const initialiseCollaborationSockets = (io : Server) => {

    io.on("connection", (socket : Socket) => {
        handleConnection(socket)

        socket.on("join-room", (roomID: string) => {
            if (verifyRoomJoinPermission(socket, roomID)){
                socket.join(roomID);
                socket.broadcast.to(roomID).emit("new-join");
            }
        })

        socket.on("leave-room",  (roomID: string) => {
            if (verifyInRoomPermission(socket, roomID)) {
                socket.leave(roomID);
                socket.to(roomID).emit("user-left", socket.data.username);
                socket.disconnect(true);    
            }
        })

        socket.on("edit-code", (roomID: string, edittedCode : string) => {
            if (verifyInRoomPermission(socket, roomID)) {
                socket.to(roomID).emit("sync-code", edittedCode);
            }
        })

        socket.on("disconnecting", () => {
            // leaves all rooms, ideally only one
            socket.rooms.forEach((roomID: string) => {
                socket.to(roomID).emit("user-left", socket.data.username);
            });
        })

        socket.on("disconnect", () => {
            console.log(`${socket.data.username} has disconnected`)
        })

    })
}