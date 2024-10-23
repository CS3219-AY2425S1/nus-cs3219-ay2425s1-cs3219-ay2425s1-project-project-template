import { Server, Socket } from "socket.io";

export const initialiseCollaborationSockets = (io : Server) => {

    const handleConnection = () => {

    }
 
    io.on("connection", (socket : Socket) => {
        handleConnection()

        io.on("join room", (roomID: string) => {
            socket.join(roomID);
        })

        io.on("leave room", (roomID: string, userName:string) => {
            socket.leave(roomID);
            socket.to(roomID).emit("user left", userName);
        })

        io.on("edit code", (edittedCode : string) => {
            socket.emit("update code", edittedCode);
        })
    })
}