import * as React from "react";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
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

            setTimeout(() => {
                navigate("/users-match");
                setIsLeaving(false);
            }, 3000);
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
                const codeType = docRef.current.getText("monaco");
                codeType.delete(0, codeType.length);
                console.log("code deleted: ", codeType);
                const messagesType = docRef.current.getArray("chatMessages");
                messagesType.delete(0, messagesType.length);
                console.log("message deleted: ", messagesType);
                docRef.current.destroy();
                docRef.current = null;
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
                    {providerRef.current && <Chat provider={providerRef.current} />}
                </Box>

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