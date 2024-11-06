import { useTheme, Button, Box, Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CodeEditor({ roomId, provider, doc, onRoomClosed}) {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState();
    const theme = useTheme();
    const navigate = useNavigate();
    const editorRef = useRef();

    function handleEditorDidMount(editor) {
        editorRef.current = editor;

        // Create Yjs text type and bind to Monaco editor
        const type = doc.getText("monaco");
        new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);
    }

    const handleRunCode = async () => {
        setIsRunning(true);

        if (editorRef.current) {
            const code = editorRef.current.getValue(); // Get the current code
            const body = {code: code};
            try {
                const response = await axios.post(`${import.meta.env.VITE_SANDBOX_URL}/sandbox/execute`, body);
                console.log('Execution result:', response.data.output);
                setOutput(response.data.output);
            } catch (error) {
                setOutput('Error executing code');
                console.error('Error executing code:', error);
            }
        }

        setIsRunning(false)
    };

    return (
        <Box sx={{ width: "100%", flexGrow: 1 }}>
            <Box sx={{ flexGrow: 4, marginBottom: 2, overflowY: "auto" }}>
                <Editor
                    height="100vh"
                    width="100%"
                    language="python"
                    defaultValue="# your code here"
                    theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
                    onMount={handleEditorDidMount}
                />
            </Box>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card variant="outlined" sx={{ width: "100%", margin: "auto", marginTop: 4, padding: 2 }}>
                    <CardContent>  
                        <Typography variant="body1" color="text.secondary">
                            {"OUTPUT: "}
                            {output}
                        </Typography>
                    </CardContent>
                </Card>
                <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleRunCode} disabled={isRunning}>
                        {isRunning ? "Running..." : "Run Code"}
                    </Button>
                </Box>
            </Box>
        </Box>

    );
}

// import { useTheme, Button, Box } from "@mui/material";
// import { useState, useRef, useEffect } from "react";
// import { Editor } from "@monaco-editor/react";
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
// import { MonacoBinding } from "y-monaco";
// import { useNavigate } from "react-router-dom";

// const serverWsUrl = "ws://localhost:4444";

// export default function CodeEditor({ roomId, onRoomClosed }) {
//     const [isLeaving, setIsLeaving] = useState(false);
//     const theme = useTheme();
//     const navigate = useNavigate();
//     const editorRef = useRef();
//     const providerRef = useRef(null);

//     function handleEditorDidMount(editor) {
//         editorRef.current = editor;

//         // Initialize yjs
//         const doc = new Y.Doc();

//         // Connect to peers with WebSocket
//         providerRef.current = new WebsocketProvider(serverWsUrl, roomId, doc);
//         const type = doc.getText("monaco");

//         // Bind yjs doc to Monaco editor
//         new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]));

//         const chatType = doc.getArray("chatMessages");

//         // const addChatMessage = (message) => {
//         //     chatType.push([{ userId: myUserId, text: message, timestamp: Date.now() }]);
//         // };

//         // chatType.observe((event) => {
//         //     event.changes.added.forEach((item) => {
//         //         item.content.getContent().forEach((message) => {
//         //             console.log("New chat message:", message);
//         //             // Handle displaying the message in your chat UI
//         //         });
//         //     });
//         // });

//         // Set up awareness listener
//         const awarenessUpdateHandler = () => {
//             if (providerRef.current) {
//                 providerRef.current.awareness.getStates().forEach((state) => {
//                     if (state.roomClosed) {
//                         handleRoomClosed();
//                     }
//                 });
//             }
//         };

//         providerRef.current.awareness.on("update", awarenessUpdateHandler);

//         // Clean up awareness listener when unmounting or disconnecting
//         return () => {
//             if (providerRef.current) {
//                 providerRef.current.awareness.off("update", awarenessUpdateHandler);
//             }
//         };
//     }

//     const handleLeaveRoom = () => {
//         setIsLeaving(true);

//         if (providerRef.current) {
//             providerRef.current.awareness.setLocalStateField("roomClosed", true);
//         }
//         navigate("/users-match");
//     };

//     const handleRoomClosed = () => {
//         if (providerRef.current) {
//             providerRef.current.disconnect();
//             providerRef.current = null;
//         }
//         onRoomClosed();
//     };

//     useEffect(() => {
//         // Cleanup on component unmount
//         return () => {
//             if (providerRef.current) {
//                 providerRef.current.disconnect();
//                 providerRef.current = null;
//             }
//         };
//     }, []);

//     return (
//         <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
//                 <Button variant="contained" color="secondary" onClick={handleLeaveRoom} disabled={isLeaving}>
//                     {isLeaving ? "Leaving..." : "Leave Room"}
//                 </Button>
//             </Box>
//             <Box sx={{ width: "50%", flexGrow: 1 }}>
//                 <Editor
//                     height="100vh"
//                     width="100%"
//                     language="cpp"
//                     defaultValue="// your code here"
//                     theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
//                     onMount={handleEditorDidMount}
//                 />
//             </Box>
//         </Box>
//     );
// }
