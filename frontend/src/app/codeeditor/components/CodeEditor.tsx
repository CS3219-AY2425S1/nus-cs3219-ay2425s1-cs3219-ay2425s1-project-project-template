"use client"

import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';

interface CodeEditorProps {
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    initialCode?: string;
    language?: string;
    theme?: 'light' | 'vs-dark';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    ydoc,
    provider,
    initialCode = '',
    language = 'javascript',
    theme = 'light',
}) => {
    const editorRef = useRef<any>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const ydocRef = useRef<Y.Doc | null>(null);

    useEffect(() => {
        const ytext = ydoc.getText('monaco');
    
        // Initialize the shared text with initialCode
        if (ytext.length === 0 && initialCode) {
          ytext.insert(0, initialCode);
        }
      }, [ydoc, initialCode]);
    
      const handleEditorDidMount: OnMount = (editor) => {
        const monacoModel = editor.getModel();
    
        if (monacoModel) {
          const ytext = ydoc.getText('monaco');
    
          // Create the Monaco binding
          const monacoBinding = new MonacoBinding(
            ytext,
            monacoModel,
            new Set([editor]),
            provider.awareness
          );
        }
      };
    
      return (
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
      );
    };
    

export default CodeEditor;