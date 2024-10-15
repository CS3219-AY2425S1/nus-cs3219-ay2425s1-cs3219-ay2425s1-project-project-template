"use client"

import { ReactNode, useEffect, useState } from "react"
import { type SocketState, WebSocketContext } from "@/contexts/websocketcontext";
import useWebSocket, { ReadyState } from "react-use-websocket"
const MATCHING_SERVICE_URL = process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL;

if (MATCHING_SERVICE_URL == undefined) {
    throw "NEXT_PUBLIC_MATCHING_SERVICE_URL was not defined in .env";
}

export default function WebSocketProvider({children}: {children: ReactNode}) {
    const [open, setOpen] = useState(false)
    const { readyState: socketState, lastMessage, sendMessage } = useWebSocket(MATCHING_SERVICE_URL as string, {}, open);
    function cancel() {
        setOpen(false)
    }

    function start() {
        setOpen(true)
    }
    
    let ret: SocketState;
    switch (socketState) {
        case ReadyState.CLOSED:
        case ReadyState.UNINSTANTIATED:
            ret = {state: "closed", start}
            break;
        case ReadyState.OPEN:
            ret = {state: "matching", cancel}
            break;
        case ReadyState.CONNECTING:
            ret = {state: "starting"}
            break;
        case ReadyState.CLOSING:
            ret = {state: "cancelling"}
            break;
    }

    return <WebSocketContext.Provider value={ret}>
        {children}
    </WebSocketContext.Provider>
}