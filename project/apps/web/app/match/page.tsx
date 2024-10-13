"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function MatchPage() {
  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);
      socket.emit("message", "HELLOOOO");
    });

    socket.on("message", (data) => {
      console.log(`Received message from server: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>random</div>;
}
