"use client"

import { ReactNode, useEffect, useState } from "react"
import { type FoundState, type SocketState, WebSocketContext } from "@/contexts/websocketcontext";
import useWebSocket, { ReadyState } from "react-use-websocket"
const MATCHING_SERVICE_URL = process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL;

if (MATCHING_SERVICE_URL == undefined) {
    throw "NEXT_PUBLIC_MATCHING_SERVICE_URL was not defined in .env";
}

export default function WebSocketProvider({children}: {children: ReactNode}) {
    const [open, setOpen] = useState(false)
    const [found, setFound] = useState<FoundState>({})
    const { readyState: socketState, lastMessage, sendMessage } = useWebSocket(MATCHING_SERVICE_URL as string, {}, open);
    
    function cancel() {
        setOpen(false)
    }
    function start() {
        setOpen(true)
        sendMessage("do match");
    }
    function ok() {
        setFound({});
    }
    
    // Acts as a message event hook 
    useEffect(() => {
        if (lastMessage == null) {
            return;
        }
        setFound({found: lastMessage.data, ok })
    }, [lastMessage])
    
    let matchState: SocketState;
    switch (socketState) {
        case ReadyState.CLOSED:
        case ReadyState.UNINSTANTIATED:
            matchState = {state: "closed", start}
            break;
        case ReadyState.OPEN:
            matchState = {state: "matching", cancel}
            break;
        case ReadyState.CONNECTING:
            matchState = {state: "starting"}
            break;
        case ReadyState.CLOSING:
            matchState = {state: "cancelling"}
            break;
    }

    return <WebSocketContext.Provider value={{...found, ...matchState}}>
        {children}
    </WebSocketContext.Provider>
}