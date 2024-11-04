import { useTheme, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { useNavigate } from "react-router-dom";

const serverWsUrl = "ws://localhost:4444";

export default function CodeEditor({ roomId, onRoomClosed }) {
    const [isLeaving, setIsLeaving] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const editorRef = useRef();
    const providerRef = useRef(null);

    function handleEditorDidMount(editor) {
        editorRef.current = editor;

        // Initialize yjs
        const doc = new Y.Doc(); 

        // Connect to peers with WebSocket
        providerRef.current = new WebsocketProvider(serverWsUrl, roomId, doc);
        const type = doc.getText("monaco");

        // Bind yjs doc to Monaco editor
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]));

        // Attach WebSocket message listener
        if (providerRef.current.ws) {
            providerRef.current.ws.onmessage = handleRoomClosed;
            providerRef.current.ws.onopen = () => {
                console.log("Connected to WebSocket server");
            };
            providerRef.current.ws.onclose = () => {
                console.log("Disconnected from WebSocket server");
            };
        }
    }

    const handleLeaveRoom = () => {
        setIsLeaving(true);

        if (providerRef.current) {
            providerRef.current.disconnect(); 
        }
        setIsLeaving(true);
        navigate("/users-match");
    };

    const handleRoomClosed = (event) => {
        console.log("Received data:", event);
        try {
            const message = JSON.parse(event.data);
            console.log("Message:", message);

            if (message.type === "roomClosed") {

                if (providerRef.current) {
                    providerRef.current.disconnect();
                }

                onRoomClosed()
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (providerRef.current && providerRef.current.ws) {
                providerRef.current.ws.removeEventListener("message", handleRoomClosed);
            }
        };
    }, [navigate]);

    return (
        <>
            <Editor
                height="100vh"
                width="50%"
                language={"cpp"}
                defaultValue={"// your code here"}
                theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
                onMount={handleEditorDidMount}
            />
            <Button variant="contained" color="secondary" onClick={handleLeaveRoom} disabled={isLeaving}>
                {isLeaving ? "Leaving..." : "Leave Room"}
            </Button>
        </>
    );
}
