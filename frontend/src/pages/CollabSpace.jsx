import * as React from "react";
import CodeEditor from "../components/CodeEditor";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CollabSpace = () => {
    const { roomId } = useParams();
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    const navigate = useNavigate(); 

    const handleRoomClosed = () => {   
        setShowRedirectMessage(true);
        setTimeout(() => {
            setShowRedirectMessage(false);
            navigate('/users-match')
        }, 3000); 
    }

    return (
        <>
            <h1>Room ID: {roomId}</h1>
            <Snackbar
                open={showRedirectMessage}
                autoHideDuration={3000}
                onClose={() => setShowRedirectMessage(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="info" variant="filled" onClose={() => setShowRedirectMessage(false)}>
                    You will be redirected soon as the room is closed.
                </Alert>
            </Snackbar>
            <CodeEditor roomId={roomId} onRoomClosed={handleRoomClosed}></CodeEditor>
        </>
    );
};

export default CollabSpace;
