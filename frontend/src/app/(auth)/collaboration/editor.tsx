import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";


function Collaboration() {
    const editorRef = useRef(null); // create a ref to the editor

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        // Initialize YJS
        const doc = new Y.Doc(); // a collection of shared objects -> Text
        // Connect to peers (or start connection) with WebRTC
        const provider = new WebrtcProvider("test-room", doc); // room1, room2
        const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
        // Bind YJS to Monaco 
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
        console.log(provider.awareness);
    }

    return (
        <Editor
            height="100vh"
            width="100vw"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue="// start collaborating here!"
            onMount={handleEditorDidMount}
        />

    )
}

export default Collaboration;