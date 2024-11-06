import * as React from "react";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import { Snackbar, Alert, Box, Button, Card, CardContent, Typography, Chip, Divider } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const serverWsUrl = import.meta.env.VITE_WS_COLLAB_URL;

const CollabSpace = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const { question } = location.state;
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
        setIsLeaving(true);
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

        if (question) {
            console.log(question);
        }

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

            <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
                <Box
                    sx={{
                        width: "40%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 2,
                    }}
                >
                    <Box sx={{ flexGrow: 4, marginBottom: 2, overflowY: "auto" }}>
                        <QuestionCard question={question} />
                    </Box>

                    <Box sx={{ flexGrow: 2, flexBasis: "50vh", marginBottom: 2, overflowY: "auto" }}>
                        {providerRef.current && <Chat provider={providerRef.current} />}
                    </Box>

                    <Box sx={{ width:"100%", alignSelf: "flex-start" }}>
                        <Button sx={{ width:"100%" }} variant="contained" color="secondary" onClick={handleLeaveRoom} disabled={isLeaving}>
                            {isLeaving ? "Leaving..." : "Leave Room"}
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ flexGrow: 1, margin: 2, overflowY: "auto" }}>
                        <CodeEditor
                            roomId={roomId}
                            provider={providerRef.current}
                            doc={docRef.current}
                            onRoomClosed={handleRoomClosed}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

const QuestionCard = ({ question }) => {
    return (
        <Card variant="outlined" sx={{ maxWidth: 600, margin: "auto", marginTop: 4, padding: 2 }}>
            <CardContent>                
                <Typography variant="h5" component="div" gutterBottom>
                    {question.title}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} marginBottom={2}>
                    <Chip label={question.category} color="primary" variant="outlined" />
                    <Chip label={`Complexity: ${question.complexity}`} color="secondary" variant="outlined" />
                </Box>

                <Divider variant="middle" sx={{ marginBottom: 2 }} />

                <Typography variant="body1" color="text.secondary">
                    {question.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CollabSpace;
