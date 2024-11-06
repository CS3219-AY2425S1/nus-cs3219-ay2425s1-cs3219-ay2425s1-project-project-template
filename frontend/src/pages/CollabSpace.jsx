import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Alert, Box, Button, CssBaseline, Snackbar, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";

const serverWsUrl = import.meta.env.VITE_WS_COLLAB_URL;

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
            <Helmet>
                <title>Collaboration Space</title>
            </Helmet>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
                <CssBaseline />

                {/* Fixed Header Section */}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'primary.light',
                        padding: 2,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '60px', // Set a fixed height for the header
                        zIndex: 1
                    }}
                >
                    <Typography variant="h6" color="white">Collaboration Room{roomId}</Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleLeaveRoom} 
                        disabled={isLeaving}
                    >
                        {isLeaving ? "Leaving..." : "Leave Room"}
                    </Button>
                </Box>

                {/* Snackbar for Redirect Message */}
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

                {/* Main Content Section */}
                <Grid 
                    container 
                    spacing={0} 
                    sx={{ 
                        flexGrow: 1, 
                        paddingTop: '60px', // Add padding to account for the fixed header
                        height: 'calc(100dvh - 60px)' // Subtract header height from total height to fit page
                    }}
                >
                    {/* Chat Section */}
                    <Grid item size={3.5} sx={{ height: '100%', overflow: 'hidden' }}>
                        {providerRef.current && <Chat provider={providerRef.current} />}
                    </Grid>

                    {/* Code Editor Section */}
                    <Grid item size={8.5} sx={{ height: '100%', overflow: 'hidden' }}>
                        <CodeEditor
                            roomId={roomId}
                            provider={providerRef.current}
                            doc={docRef.current}
                            onRoomClosed={handleRoomClosed}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default CollabSpace;