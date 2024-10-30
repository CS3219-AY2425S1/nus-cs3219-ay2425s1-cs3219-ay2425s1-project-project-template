import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import io from 'socket.io-client';

import CollabNavBar from "../components/navbar/CollabNavbar";
import QuitConfirmationPopup from "../components/collaboration/QuitConfirmationPopup";
import PartnerQuitPopup from "../components/collaboration/PartnerQuitPopup";
import TimeUpPopup from "../components/collaboration/TimeUpPopup";
import useAuth from "../hooks/useAuth";

const yjsWsUrl = "ws://localhost:8201/yjs";  // y-websocket now on port 8201
const socketIoUrl = "http://localhost:8200";  // Socket.IO remains on port 8200

const Collab = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useAuth();

    const ydoc = useRef(new Y.Doc()).current;
    const editorRef = useRef(null);
    const socketRef = useRef(null);
    const providerRef = useRef(null);
    const intervalRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [countdown, setCountdown] = useState(100); // changed to 10s for testing
    const [timeOver, setTimeOver] = useState(false);
    const [userLeft, setUserLeft] = useState(false);

    const [showQuitPopup, setShowQuitPopup] = useState(false);
    const [showPartnerQuitPopup, setShowPartnerQuitPopup] = useState(false);

    // Ensure location state exists, else redirect to home
    useEffect(() => {
        if (!location.state) {
            navigate("/home");
            return;
        }

        const { roomId } = location.state;

        // Setup socket.io connection
        socketRef.current = io(socketIoUrl);

        // Emit events on connection
        socketRef.current.emit("add-user", username?.toString());
        socketRef.current.emit("join-room", roomId);

        // Listen for user-left event for the specific room
        socketRef.current.on("user-left", () => {
            setShowPartnerQuitPopup(true);
        });

        // Clean up on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.emit("user-left", roomId);
                socketRef.current.disconnect();
            }
        };
    }, [username, location.state, navigate]);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (providerRef.current) {
                providerRef.current.destroy();
            }
        };
    }, []);

    // Timer function
    useEffect(() => {
        if (countdown > 0 && !timeOver) {
            intervalRef.current = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(intervalRef.current); // Clear interval at end of countdown
                        setTimeOver(true);
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [countdown, timeOver]);
    if (!location.state) {
        return null;
    }

    const { difficulty, topic, language, matchedUser, roomId } = location.state;
    const partnerUsername = matchedUser.user1 === username ? matchedUser.user2 : matchedUser.user1;

    // Initialize editor and Yjs binding
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        editorRef.current.setValue("");

        const monacoText = ydoc.getText("monaco");
        monacoText.delete(0, monacoText.length);

        providerRef.current = new WebsocketProvider(yjsWsUrl, location.state.roomId, ydoc);
        new MonacoBinding(monacoText, editorRef.current.getModel(), new Set([editorRef.current]));

        providerRef.current.on('status', (event) => {
            console.log(event.status); // logs "connected" or "disconnected"
        });
    };

    const handleQuit = () => setShowQuitPopup(true);

    const handleQuitConfirm = () => {
        setShowPartnerQuitPopup(false);
        socketRef.current.emit("user-left", location.state.roomId);
        providerRef.current?.destroy();
        navigate("/home");
    };

    const handleQuitCancel = () => setShowQuitPopup(false);

    if (!location.state) return null;

    const { difficulty, topic, language, matchedUser, roomId } = location.state;
    const partnerUsername = matchedUser.user1 === username ? matchedUser.user2 : matchedUser.user1;

    const handleContinueSession = () => {
        clearInterval(intervalRef.current);
        setCountdown(10);  // changed to 10s for testing
        setTimeOver(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
            <CollabNavBar 
                partnerUsername={partnerUsername} 
                countdown={formatTime(countdown)} 
                handleSubmit={handleSubmit}
                countdown={"30:00"} 
                handleQuit={handleQuit}
            />
            <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                defaultLanguage="python"
                language={language}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false }
                }}
            />
            {/* Conditionally render popups */}
            {showQuitPopup && (
                <QuitConfirmationPopup 
                    confirmQuit={handleQuitConfirm} 
                    cancelQuit={handleQuitCancel} 
                />
            )}
            {showPartnerQuitPopup && (
                <PartnerQuitPopup 
                    confirmQuit={handleQuitConfirm} 
                    cancelQuit={() => setShowPartnerQuitPopup(false)} 
                />
            )}
            {timeOver && (
                <TimeUpPopup 
                    continueSession={handleContinueSession}
                    quitSession={handleQuitConfirm}/>
            )}
        </div>
    );
};

export default Collab;