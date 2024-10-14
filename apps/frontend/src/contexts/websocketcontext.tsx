import { createContext } from "react";

type SocketState = {
    toggle: () => void;
    open: boolean;
};

export const WebSocketContext = createContext<SocketState | null>(null);

