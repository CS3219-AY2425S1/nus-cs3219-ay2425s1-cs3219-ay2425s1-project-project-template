import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import io, { type Socket } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SocketContextType {
  socket: Socket | null;
}

const socketIOURL = process.env.NEXT_PUBLIC_COLLABORATION_SERVICE_SOCKET_IO_URL;

export const SocketContext = createContext<SocketContextType>({ socket: null });

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socketIOURL) {
      toast.error("Could not connect to the server", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Server Error: Could not connect to the server");
    } else {
      const socketIOInstance = io(socketIOURL, {
        path: process.env.NEXT_PUBLIC_COLLAB_SERVICE_PATH,
        transports: ["websocket"],
      });
      console.log(socketIOInstance)
      setSocket(socketIOInstance);
      console.log("SocketIO instance connected");
    }

    return () => {
      socket?.disconnect();
      console.log("SocketIO instance disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      <ToastContainer />
      {children}
    </SocketContext.Provider>
  );
};
