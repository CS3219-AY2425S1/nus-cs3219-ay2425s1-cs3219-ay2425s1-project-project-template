import { createContext } from "react";

export type SocketState = {
    state: "cancelling" | "starting"
} | {
    state: "closed";
    start(): void;
} | {
    state: "matching";
    cancel(): void;
} | {
    state: "ready";
    id: string;
    ok(): void;
};

export const WebSocketContext = createContext<SocketState | null>(null);

