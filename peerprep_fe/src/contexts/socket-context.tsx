"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { DifficultyLevel } from "@/app/types/QuestionDto";
import {
  ClientSocketEvents,
  ClientToServerEvents,
  MatchRequest,
  ServerSocketEvents,
  ServerToClientEvents,
} from "@/app/types/SocketTypes";
import { useAuth } from "./auth-context";

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  sendMatchRequest: (
    selectedDifficulty: DifficultyLevel,
    selectedTopic: string
  ) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "http://localhost:5003",
      {
        auth: {
          token: token,
        },
      }
    );

    newSocket.on("connect", () => {
      console.log("Connected to socket");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsConnected(false);
    });

    newSocket.on(ServerSocketEvents.MATCH_CANCELED, () => {
      console.log("match cancelled");

      // Handle different types of messages here
    });
    newSocket.on(ServerSocketEvents.MATCH_FOUND, (message) => {
      console.log("Match found", message);
      // Handle different types of messages here
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const sendMatchRequest = (
    selectedDifficulty: DifficultyLevel,
    selectedTopic: string
  ) => {
    if (socket) {
      const matchRequest: MatchRequest = {
        event: ClientSocketEvents.REQUEST_MATCH,
        selectedDifficulty,
        selectedTopic,
      };
      socket.emit(ClientSocketEvents.REQUEST_MATCH, matchRequest);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMatchRequest }}>
      {children}
    </SocketContext.Provider>
  );
};
