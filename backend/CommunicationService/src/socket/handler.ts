import { Server, Socket } from "socket.io";
import { SignalData } from "simple-peer";

const handleConnection = (socket: Socket) : void => {
    const userId = socket.handshake.auth.userId;
    const username = socket.handshake.auth.username;
    if (!userId) {
      socket.emit("connection-error", { message: "User ID is required" });
      socket.disconnect(true);
      return;
    }
    if (!username) {
      socket.emit("connection-error", { message: "Username is required" });
      socket.disconnect(true);
      return;
    }
    socket.data.userId = userId;
    socket.data.username = username;
}

export const initialiseCommunicationHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        handleConnection(socket);
        // video call events 
        socket.on("initiate-call", (roomId: string) => {
            console.log(roomId);
            socket.to(roomId).emit("incoming-call");
        })

        socket.on("join-comms-room", (roomId: string) => {
            console.log(roomId);
            socket.join(roomId);
            console.log(`${socket.data.username} has join the ${roomId}`);
        })

        socket.on("initiate-call", (roomId: string) => {
            socket.to(roomId).emit("incoming-call");
            console.log(`${socket.data.username} initiated`);
        })

        socket.on("call-response", (isAnswer: boolean, roomId: string) => {
            socket.to(roomId).emit("call-response", isAnswer);
            console.log(`${socket.data.username} has responded with a ${isAnswer? "Yes" : "No"}`);
        })

        socket.on("signal", (roomId: string, signal: SignalData) => {
            socket.to(roomId).emit("signal", signal);
            console.log(`${socket.data.username} signalled`);
        })

        socket.on("disconnect", () => {
           console.log(`${socket.data.username} has left`)
        })
        // chatting events
    })
}