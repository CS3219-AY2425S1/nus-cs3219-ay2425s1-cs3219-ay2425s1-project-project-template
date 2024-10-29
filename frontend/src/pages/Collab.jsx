import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import io from 'socket.io-client';

import CollabNavBar from "../components/navbar/CollabNavbar";
import useAuth from "../hooks/useAuth";

const serverWsUrl = "ws://localhost:8200/collaboration";

const Collab = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useAuth();

    const ydoc = useRef(new Y.Doc()).current;
    const editorRef = useRef(null);
    const socketRef = useRef(null);
    const providerRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [countdown, setCountdown] = useState(1800);
    const [timeOver, setTimeOver] = useState(false);
    const [userLeft, setUserLeft] = useState(false);

    // Setup socket connection
    useEffect(() => {
        if (!location.state) {
            navigate("/home");
            return;
        }

        socketRef.current = io(serverWsUrl);
        socketRef.current.emit("add-user", username?.toString());

        return () => {
            if (socketRef.current) {
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


    if (!location.state) {
        return null;
    }

    const { difficulty, topic, language, matchedUser, roomId } = location.state;
    const partnerUsername = matchedUser.user1 === username ? matchedUser.user2 : matchedUser.user1;

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        editorRef.current.setValue("");

        const monacoText = ydoc.getText("monaco");
        monacoText.delete(0, monacoText.length);

        providerRef.current = new WebsocketProvider(serverWsUrl, roomId, ydoc);
        new MonacoBinding(monacoText, editorRef.current.getModel(), new Set([editorRef.current]));

        providerRef.current.on('status', event => {
            console.log(event.status); // logs "connected" or "disconnected"
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100vw"
            }}
        >
            <CollabNavBar partnerUsername={partnerUsername} countdown={"30:00"}/>
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
        </div>
    );
};

export default Collab;