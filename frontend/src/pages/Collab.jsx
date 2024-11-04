import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import io from 'socket.io-client';

import CollabNavBar from "../components/navbar/CollabNavbar";
import QuestionContainer from "../components/collaboration/QuestionContainer";
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

    const [countdown, setCountdown] = useState(20); // set to 1 min default timer
    const [timeOver, setTimeOver] = useState(false);

    const [showQuitPopup, setShowQuitPopup] = useState(false);
    const [showPartnerQuitPopup, setShowPartnerQuitPopup] = useState(false);

    const [isSoloSession, setIsSoloSession] = useState(false);

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

        // Listen for 'start-timer' event to start countdown (used for both new session and continue session)
        socketRef.current.on('start-timer', () => {
            setCountdown(20); // Reset to your desired starting time
            setTimeOver(false);
            startCountdown();
        });

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

    const startCountdown = () => {

        // Clear any existing interval to avoid multiple intervals running at once
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalRef.current);
                    setTimeOver(true);
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    // Initialize editor and Yjs 
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

    if (!location.state) { return null; }

    const { question, language, matchedUser, roomId } = location.state;
    const partnerUsername = matchedUser.user1 === username ? matchedUser.user2 : matchedUser.user1;

    const handleSubmit = () => { console.log("Submit code"); };

    const handleQuit = () => setShowQuitPopup(true);

    const handleQuitConfirm = () => {
        setShowPartnerQuitPopup(false);
        socketRef.current.emit("user-left", location.state.roomId);
        providerRef.current?.destroy();
        navigate("/home");
    };

    const handleQuitCancel = () => setShowQuitPopup(false);

    const handleContinueSession = () => {
        socketRef.current.emit("continue-session", roomId);
    };

    const handleContinueSessionAlone = () => {
        setCountdown(20); // Reset to your desired starting time
        setTimeOver(false);
        startCountdown();
        setIsSoloSession(true);
    }

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
                handleQuit={handleQuit}
            />
            <div style={{ display: "flex", flex: 1 }}>
                <QuestionContainer question={question} />
                <Editor
                    height="100%"
                    width="50%"
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
            </div>
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
                    quitSession={handleQuitConfirm}
                    continueAlone={handleContinueSessionAlone}
                    isSoloSession={isSoloSession}/>
            )}
        </div>
    );
};

export default Collab;