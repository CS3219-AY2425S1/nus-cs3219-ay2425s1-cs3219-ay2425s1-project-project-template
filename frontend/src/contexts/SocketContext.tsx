import { createContext, MutableRefObject, ReactNode, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketContextInterface {
  collabSocketRef: MutableRefObject<Socket| null>,
  commSocketRef: MutableRefObject<Socket| null>
}

export const SocketContext = createContext<SocketContextInterface | null>(null);

type ContextProviderNode = {
    children: ReactNode
};

export const SocketContextProvider = ({ children } : ContextProviderNode) => {
    const collabSocketRef = useRef<Socket | null>(null);
    const commSocketRef = useRef<Socket | null>(null);


  return (
    <SocketContext.Provider value={{ collabSocketRef, commSocketRef }}>
      {children}
    </SocketContext.Provider>
  );

}

export const useSocket = (): SocketContextInterface => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("Socket is null");
    }
    return context;
};
