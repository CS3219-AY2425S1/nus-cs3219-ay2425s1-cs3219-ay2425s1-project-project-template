import { Server, Socket } from "socket.io";
import {
  handleConnection,
  handleJoinRoom,
  handleSendMessage,
} from "../controllers/chatController";
import { SignalData } from "simple-peer";

export function initializeCommunicationSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    // Initial connection setup
    handleConnection(socket);

    // Listen for joining a room
    socket.on("joinRoom", (roomId: string) => {
      handleJoinRoom(socket, roomId);
    });

    // Listen for sending chat messages to a specific room
    socket.on("chatMessage", ({ roomId, text }) => {
      console.log("Received room:", roomId);
      console.log("Received message:", text);
      handleSendMessage(io, socket, roomId, text);
    });

    // video call events
    socket.on("initiate-call", (roomId: string) => {
      console.log(roomId);
      socket.to(roomId).emit("incoming-call");
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
    

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${socket.data.username} disconnected`);
    });
  });
}
