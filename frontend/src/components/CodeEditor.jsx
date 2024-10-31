import { useTheme } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { editor } from "monaco-editor";

const serverWsUrl = "ws://localhost:4444";

export default function CodeEditor() {
    const theme = useTheme();
    
    const editorRef = useRef();
    
    function handleEditorDidMount(editor) {
        editorRef.current = editor;

        // Initialize yjs
        const doc = new Y.Doc(); // collection of shared objects

        // Connect to peers with WebSocket
        const provider = new WebsocketProvider(serverWsUrl, "roomId", doc);
        const type = doc.getText("monaco");

        // Bind yjs doc to Manaco editor
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]));

    }

    return (
        <>
        <Editor 
            height="100vh"
            language={"cpp"}
            defaultValue={"// your code here"}
            theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
            onMount={handleEditorDidMount}
        />
        </>
    );
}