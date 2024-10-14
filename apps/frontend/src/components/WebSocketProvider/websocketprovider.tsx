"use client"

import { ReactNode, useState } from "react"
import { WebSocketContext } from "@/contexts/websocketcontext";

export default function WebSocketProvider({children}: {children: ReactNode}) {
    const [open, setOpen] = useState(false)
    function toggle() {
        if (open) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    return <WebSocketContext.Provider value = {{toggle, open}}>
        {children}
    </WebSocketContext.Provider>
}