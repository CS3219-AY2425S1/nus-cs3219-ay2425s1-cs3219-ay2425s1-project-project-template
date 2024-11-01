import { createContext, Dispatch, MutableRefObject, ReactNode, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export interface SocketContextInterface {
  collabSocket: Socket | null,
  commSocket: Socket | null,
  setCollabSocket: Dispatch<SetStateAction<Socket| null>>,
  setCommSocket: Dispatch<SetStateAction<Socket| null>>
}

export const SocketContext = createContext<SocketContextInterface | null>(null);

type ContextProviderNode = {
    children: ReactNode
};

export const SocketContextProvider = ({ children } : ContextProviderNode) => {
    const [collabSocket, setCollabSocket] = useState<Socket | null>(null);
    const [commSocket, setCommSocket] = useState<Socket | null>(null);
    const { user } = useContext(AuthContext);


  return (
    <SocketContext.Provider value={{ collabSocket, commSocket, setCollabSocket, setCommSocket }}>
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
