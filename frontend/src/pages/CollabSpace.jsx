import * as React from "react";
import CodeEditor from "../components/CodeEditor";
import { Snackbar, Alert, Box, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const serverWsUrl = "ws://localhost:4444";

const CollabSpace = () => {
    const { roomId } = useParams();
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false); // Loading state
    const navigate = useNavigate();
    const docRef = useRef(null);
    const providerRef = useRef(null);
    const hasClosedRef = useRef(false); // Flag to ensure `handleRoomClosed` is only called once

    const handleRoomClosed = () => {
        if (hasClosedRef.current) return; // Prevent multiple triggers
        hasClosedRef.current = true;

        if (providerRef.current) {
            providerRef.current.destroy();
            providerRef.current = null;
        }

        setShowRedirectMessage(true);
        setTimeout(() => {
            setShowRedirectMessage(false);
            navigate("/users-match");
        }, 3000);
    };

    const handleLeaveRoom = () => {
        if (!providerRef.current) {
            console.warn("Provider already destroyed or not initialized.");
            return;
        }
    
        setIsLeaving(true);
    
        if (providerRef.current) {
            providerRef.current.awareness.setLocalStateField("roomClosed", true);
            // providerRef.current.destroy(); // Thorough cleanup
            // providerRef.current = null; // Set to null to avoid repeated calls
    
            // Delay navigation slightly to ensure state is shared before navigation
            setTimeout(() => {
                navigate("/users-match");
                setIsLeaving(false);
            }, 300);
        }
    };

    useEffect(() => {
        console.log("mounting");

        if (!docRef.current) {
            docRef.current = new Y.Doc();
        }

        if (!providerRef.current) {
            providerRef.current = new WebsocketProvider(`${serverWsUrl}?room=${roomId}`, roomId, docRef.current);
            setIsInitialized(true); // Mark initialization as complete once provider is set
        }

        const awarenessUpdateHandler = () => {
            if (providerRef.current && !hasClosedRef.current) {
                const awarenessStates = providerRef.current.awareness.getStates();
                awarenessStates.forEach((state) => {
                    if (state.roomClosed) {
                        console.log("room closed!!");
                        handleRoomClosed();
                    }
                });
            }
        };

        if (providerRef.current) {
            providerRef.current.awareness.on("update", awarenessUpdateHandler);
        }

        return () => {
            if (providerRef.current) {
                providerRef.current.awareness.off("update", awarenessUpdateHandler);
                providerRef.current.destroy();
                providerRef.current = null;
                hasClosedRef.current = false;
            }
        };
    }, [roomId]);

    if (!isInitialized) {
        // Render a loading indicator or placeholder until initialization completes
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Room ID: {roomId}</h1>
            <Snackbar
                open={showRedirectMessage}
                autoHideDuration={3000}
                onClose={() => setShowRedirectMessage(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="info" variant="filled" onClose={() => setShowRedirectMessage(false)}>
                    You will be redirected soon as the room is closed.
                </Alert>
            </Snackbar>

            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
                    <Button variant="contained" color="secondary" onClick={handleLeaveRoom} disabled={isLeaving}>
                        {isLeaving ? "Leaving..." : "Leave Room"}
                    </Button>
                </Box>

                {/* Code Editor Component */}
                <Box sx={{ width: "45%", display: "flex", flexDirection: "column" }}>
                    <CodeEditor
                        roomId={roomId}
                        provider={providerRef.current}
                        doc={docRef.current}
                        onRoomClosed={handleRoomClosed}
                    />
                </Box>
            </Box>
        </>
    );
};

export default CollabSpace;


// import * as React from "react";
// import CodeEditor from "../components/CodeEditor";
// import { Snackbar, Alert, Box } from "@mui/material";
// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const CollabSpace = () => {
//     const { roomId } = useParams();
//     const [showRedirectMessage, setShowRedirectMessage] = useState(false);
//     const navigate = useNavigate();

//     const handleRoomClosed = () => {
//         setShowRedirectMessage(true);
//         setTimeout(() => {
//             setShowRedirectMessage(false);
//             navigate("/users-match");
//         }, 3000);
//     };

//     return (
//         <>
//             <h1>Room ID: {roomId}</h1>
//             <Snackbar
//                 open={showRedirectMessage}
//                 autoHideDuration={3000}
//                 onClose={() => setShowRedirectMessage(false)}
//                 anchorOrigin={{ vertical: "top", horizontal: "center" }}
//             >
//                 <Alert severity="info" variant="filled" onClose={() => setShowRedirectMessage(false)}>
//                     You will be redirected soon as the room is closed.
//                 </Alert>
//             </Snackbar>
//             <Box sx={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>

//             </Box>
//             <Box sx={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>
//                 <CodeEditor roomId={roomId} onRoomClosed={handleRoomClosed}></CodeEditor>
//             </Box>
//         </>
//     );
// };

// export default CollabSpace;
