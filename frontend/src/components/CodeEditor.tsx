"use client"

import React, { useRef, useEffect } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'light' | 'vs-dark';
  roomId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'javascript',
  theme = 'light',
  roomId,
}) => {
    const editorRef = useRef<any>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const ydocRef = useRef<Y.Doc | null>(null);

    useEffect(() => {
        // Create a new Yjs document
        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;

        // Set up the WebSocket provider
        // TBC WEBSOCKET STUFF
        const provider = new WebsocketProvider('ws://localhost:1234', roomId, ydoc);
        providerRef.current = provider;

        // Get the shared text type
        const ytext = ydoc.getText('monaco');

        // Initialize the shared text with initialCode
        if (ytext.length === 0 && initialCode) {
        ytext.insert(0, initialCode);
        }

        return () => {
        provider.destroy();
        ydoc.destroy();
        };
    }, [initialCode, roomId]);
    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;

        const monacoModel = editor.getModel();

        if (monacoModel && ydocRef.current && providerRef.current) {
        const ytext = ydocRef.current.getText('monaco');

        // Create the Monaco binding
        const monacoBinding = new MonacoBinding(
            ytext,
            monacoModel,
            new Set([editor]),
            providerRef.current.awareness
        );

        // Set user awareness (optional)
        providerRef.current.awareness.setLocalStateField('user', {
            name: 'User ' + Math.floor(Math.random() * 1000),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        });
        }
    };
    return (
        <div className="code-editor-container" style={{ height: '500px' }}>
        <Editor
            height="100%"
            defaultLanguage={language}
            theme={theme}
            onMount={handleEditorDidMount}
            options={{
            fontSize: 14,
            minimap: { enabled: false },
            }}
        />
        </div>
    )
};

export default CodeEditor;