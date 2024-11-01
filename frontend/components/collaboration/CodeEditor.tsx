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
  onCodeChange?: (code: string) => void; 
}

export default function CodeEditor({ setOutput, onCodeChange }: CodeEditorProps) {
  const codeEditorRef = useRef<editor.IStandaloneCodeEditor>();
  const monaco = useMonaco();

// Function to handle code execution
const executeCode = async () => {
  if (!codeEditorRef.current) return;
  const code = codeEditorRef.current.getValue();

  onCodeChange?.(code);

  // Get the language from the Monaco editor
  const currentLanguage = codeEditorRef.current.getModel()?.getLanguageId();
  
  // Safely check if currentLanguage is defined, and fetch from languageMap
  const languageId = currentLanguage && languageMap[currentLanguage] ? languageMap[currentLanguage] : 63; // Default to JavaScript if not found

  try {
    // Submit code to backend for execution
    const response = await axios.post(`${API_BASE_URL}/api/code-execute`, {
      source_code: code,
      language_id: languageId,
    });

    // Extract token and ensure it is a string
    const token = response.data.token;

    // Poll for result using the token
    const intervalId = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/code-execute/${token}`, {
          params: { base64_encoded: "false", fields: "*" },
        });

        if (data.status.id === 3) { // Check if execution completed
          clearInterval(intervalId);
          setOutput(data.stdout || data.stderr || "No output");
        } else if (data.status.id > 3) { // Handle errors
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

  // Runs once when the component mounts
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

      // Listen to changes and notify parent
      codeEditorRef.current?.onDidChangeModelContent(() => {
        const code = codeEditorRef.current?.getValue();
        if (code !== undefined) {
          onCodeChange?.(code);
        }
      });
    }
  }, [monaco]);


  return (
    <div>
      <Editor
        height="100vh"
        language="javascript"
        options={{
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
          fontSize: 14,
        }}
        theme="vs-dark"
        width="50vw"
        onMount={(editor) => {
          codeEditorRef.current = editor;
        }}
      />
      <button onClick={executeCode} style={{ marginTop: "10px" }}>
        Run Code
      </button>
    </div>
  );
}
