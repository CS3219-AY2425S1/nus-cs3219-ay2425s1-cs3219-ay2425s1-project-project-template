import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react"
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import Peer from "peerjs"
import io from 'socket.io-client';
import process from "process";
import { Buffer } from "buffer";

import CollabNavBar from "../components/navbar/CollabNavbar";
import useAuth from "../hooks/useAuth";

window.process = { env: { NODE_ENV: "development" } };
window.Buffer = Buffer;

const Collab = () => {
    const editorRef = useRef(null);
    const ydoc = new Y.Doc();
    const socketRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3001"); // connect to server
        peerInstance.current = new Peer();

        peerInstance.current.on("open", (id) => {
            console.log(`My peer ID is: ${id}`);
            socketRef.current.emit('join', id);
        });

        socketRef.current.on("peer-connect", (peerId) => {
            const conn = peerInstance.current.connect(peerId);

            conn.on("open", () => {
                console.log("Connected to peer via WebRTC");

                const editor = editorRef.current.editor;
                const type = ydoc.getText("monaco");
                new MonacoBinding(type, editor.getModel(), new Set([editor]), ydoc);
            });
        });

        return () => {
            ydoc.destroy();
            peerInstance.current.destroy();
        }
    }, []);
    
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100vw"
            }}
        >
            <CollabNavBar />
            <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                defaultLanguage="javascript"
                editorDidMount={(editor) => {
                    editorRef.current = { editor };
                }}
            />
        </div>
    )

}

export default Collab;