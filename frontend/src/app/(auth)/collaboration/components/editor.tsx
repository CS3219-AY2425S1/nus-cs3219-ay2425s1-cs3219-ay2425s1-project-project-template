import React, { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { getUser } from "@/api/user";
import { Cursors } from "./cursors";
import { Toolbar } from "./toolbar";

type Props = {
    room: string;
    language: string;
}

function Collaboration({ room, language }: Props) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const docRef = useRef(new Y.Doc()); // Initialize a single YJS document
    const providerRef = useRef(null); // Ref to store the provider instance
    const [username, setUsername] = useState<string | null>(null);
    const [selectionRange, setSelectionRange] = useState(null);

    // Fetch username on component mount
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const user = await getUser();
                setUsername(user.data.username);
            } catch (err) {
                console.error("Failed to fetch username:", err);
                setUsername("Anonymous");
            }
        };
        fetchUsername();
    }, []);

    // Initialize WebRTC provider once per room
    useEffect(() => {
        if (!providerRef.current) {
            const signalingServer = ['ws://localhost:4444'];
            providerRef.current = new WebrtcProvider(room, docRef.current, { signaling: signalingServer });

            // Cleanup provider on component unmount or when room changes
            return () => {
                providerRef.current.destroy();
                providerRef.current = null;
            };
        }
    }, [room]);

    const saveSession = useCallback(async () => {
        if (docRef.current) {
            const serializedDoc = Buffer.from(Y.encodeStateAsUpdate(docRef.current)).toString("base64");
            const url = "http://localhost:3001/api/update/" + room;
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ room, doc: serializedDoc }),
                });
                const data = await res.json();
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        }
    }, [room]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;

        if (providerRef.current && docRef.current) {
            const type = docRef.current.getText("monaco");

            // Bind YJS text to Monaco editor
            new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), providerRef.current.awareness);
        }

        editor.onDidChangeCursorPosition((e) => {
            var selection = editorRef.current.getSelection();
            if (selection) {
                setSelectionRange(selection);
            }
        });
    }

    // Save session before page unload
    useEffect(() => {
        const handleBeforeUnload = async (e) => {
            e.preventDefault();
            await saveSession();
            e.returnValue = ''; // Chrome requires returnValue to be set
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [room, saveSession]);

    return (
        <div style={{ backgroundColor: "#1e1e1e", color: "#d4d4d4", height: "100vh", width: "100vw" }}>
            {providerRef.current && username ? (
            <Cursors yProvider={providerRef.current} username={username} cursorPosition={selectionRange || {}}/>) : null}
            <Toolbar editor={editorRef.current} />
            <Editor
            height="100vh"
            width="100vw"
            theme="vs-dark"
            defaultLanguage={language}
            defaultValue="// start collaborating here!"
            onMount={handleEditorDidMount}
            />
        </div>
    );
}

export default Collaboration;