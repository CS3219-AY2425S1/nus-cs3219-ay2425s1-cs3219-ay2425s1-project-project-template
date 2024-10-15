import { createContext } from "react";

export type SocketState = {
    state: "cancelling" | "starting"
} | {
    state: "closed";
    start(): void;
} | {
    state: "matching";
    cancel(): void;
};

export type FoundState = {} | {
    found: string;
    ok(): void;
};

type MatchState = SocketState & FoundState;

export const WebSocketContext = createContext<MatchState | null>(null);

