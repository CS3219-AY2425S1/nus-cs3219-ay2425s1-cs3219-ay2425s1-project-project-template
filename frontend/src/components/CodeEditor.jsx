import { useTheme, Button, Box } from "@mui/material";
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
        new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]));

        // Set up awareness listener
        const awarenessUpdateHandler = () => {
            if (providerRef.current) {
                providerRef.current.awareness.getStates().forEach((state) => {
                    if (state.roomClosed) {
                        handleRoomClosed();
                    }
                });
            }
        };

        providerRef.current.awareness.on("update", awarenessUpdateHandler);

        // Clean up awareness listener when unmounting or disconnecting
        return () => {
            if (providerRef.current) {
                providerRef.current.awareness.off("update", awarenessUpdateHandler);
            }
        };
    }

    const handleLeaveRoom = () => {
        setIsLeaving(true);
        
        if (providerRef.current) {
            providerRef.current.awareness.setLocalStateField("roomClosed", true);
        }
        navigate("/users-match");
    };

    const handleRoomClosed = () => {
        if (providerRef.current) {
            providerRef.current.disconnect();
            providerRef.current = null;
        }
        onRoomClosed();
    };

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            if (providerRef.current) {
                providerRef.current.disconnect();
                providerRef.current = null;
            }
        };
    }, []);

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleLeaveRoom} disabled={isLeaving}>
                    {isLeaving ? "Leaving..." : "Leave Room"}
                </Button>
            </Box>
            <Box sx={{ width: "50%", flexGrow: 1 }}>
                <Editor
                    height="100vh"
                    width="100%"
                    language="cpp"
                    defaultValue="// your code here"
                    theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
                    onMount={handleEditorDidMount}
                />
            </Box>
        </Box>
    );
}
