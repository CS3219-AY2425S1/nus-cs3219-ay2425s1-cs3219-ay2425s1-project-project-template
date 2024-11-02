import { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import axios from "axios";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";

const randomColor = require("randomcolor");
const API_BASE_URL = process.env.NEXT_PUBLIC_COLLABORATION_SERVICE_SOCKET_IO_URL;

// Mapping Monaco editor languages to API language IDs
const languageMap: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  csharp: 51,
  // Add more mappings as needed
};

interface CodeEditorProps {
  setOutput: React.Dispatch<React.SetStateAction<string>>;
  language: string; // Accept language as a prop
}

export default function CodeEditor({ setOutput, language }: CodeEditorProps) {
  const codeEditorRef = useRef<editor.IStandaloneCodeEditor>();
  const monaco = useMonaco();

  const executeCode = async () => {
    if (!codeEditorRef.current) return;
    const code = codeEditorRef.current.getValue();
    const languageId = languageMap[language.toLowerCase()] ?? 63;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/code-execute`, {
        source_code: code,
        language_id: languageId,
      });
      const token = response.data.token;

      const intervalId = setInterval(async () => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/code-execute/${token}`, {
            params: { base64_encoded: "false", fields: "*" },
          });

          if (data.status.id === 3) {
            clearInterval(intervalId);
            setOutput(data.stdout || data.stderr || "No output");
          } else if (data.status.id > 3) {
            clearInterval(intervalId);
            setOutput(data.stderr || "An error occurred");
          }
        } catch (error) {
          clearInterval(intervalId);
          console.error("Error fetching code execution result:", error);
          setOutput("Something went wrong while fetching the code execution result.");
        }
      }, 1000);

    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Something went wrong during code execution.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && monaco) {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider("ws://localhost:1234", "temp", ydoc);
      const yDocTextMonaco = ydoc.getText("monaco");

      if (codeEditorRef.current) {
        new MonacoBinding(
          yDocTextMonaco,
          codeEditorRef.current.getModel()!,
          new Set([codeEditorRef.current]),
          provider.awareness
        );
      }
    }
  }, [monaco]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <button
        onClick={executeCode}
        style={{
          alignSelf: 'center',
          padding: '8px 16px',
          marginBottom: '8px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Run Code
      </button>
      <Editor
        height="75vh"
        language={language.toLowerCase()}
        options={{
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
          fontSize: 14,
        }}
        theme="vs-dark"
        width="100%"
        onMount={(editor) => {
          codeEditorRef.current = editor;
        }}
      />
    </div>
  );
}
