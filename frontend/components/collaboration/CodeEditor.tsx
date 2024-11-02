import { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import axios from "axios";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";

var randomColor = require("randomcolor"); // import the script

interface CodeEditorProps {
  roomId: string;
  setOutput: React.Dispatch<React.SetStateAction<string>>;
  language: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_COLLABORATION_SERVICE_SOCKET_IO_URL;

// Mapping Monaco editor languages to API language IDs
const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  csharp: 51,
  // Add more mappings as needed
};

export default function CodeEditor({
  setOutput,
  roomId,
  language,
}: CodeEditorProps) {
  const codeEditorRef = useRef<editor.IStandaloneCodeEditor>();
  const monaco = useMonaco();

  // Function to handle code execution
  const executeCode = async () => {
    if (!codeEditorRef.current) return;
    const code = codeEditorRef.current.getValue();

    // Get the language from the Monaco editor
    const currentLanguage = codeEditorRef.current.getModel()?.getLanguageId();

    // Safely check if currentLanguage is defined, and fetch from languageMap
    const languageId =
      currentLanguage && LANGUAGE_MAP[currentLanguage]
        ? LANGUAGE_MAP[currentLanguage]
        : 63; // Default to JavaScript if not found

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
          const { data } = await axios.get(
            `${API_BASE_URL}/api/code-execute/${token}`,
            {
              params: { base64_encoded: "false", fields: "*" },
            },
          );

          if (data.status.id === 3) {
            // Check if execution completed
            clearInterval(intervalId);
            setOutput(data.stdout || data.stderr || "No output");
          } else if (data.status.id > 3) {
            // Handle errors
            clearInterval(intervalId);
            setOutput(data.stderr || "An error occurred");
          }
        } catch (error) {
          clearInterval(intervalId);
          console.error("Error fetching code execution result:", error);
          setOutput(
            "Something went wrong while fetching the code execution result.",
          );
        }
      }, 1000);
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Something went wrong during code execution.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && monaco) {
      // create a yew yjs doc
      const ydoc = new Y.Doc();
      // establish partykit as your websocket provider
      const provider = new WebsocketProvider(
        process.env.NEXT_PUBLIC_COLLAB_SERVICE_Y_SERVER_PATH ||
          "ws://localhost:2501",
        roomId,
        ydoc,
      );
      // awareness for collaborative features
      const yAwareness = provider.awareness;
      // get the text from the monaco editor
      const yDocTextMonaco = ydoc.getText("monaco");

      const editor = monaco.editor.getEditors()[0];
      const userColor = randomColor();

      yAwareness.setLocalStateField("user", {
        name: "PeerPrep",
        userId: "1234",
        email: "peerprep@gmail.com",
        color: userColor,
      });

      yAwareness.on(
        "change",
        (changes: {
          added: number[];
          updated: number[];
          removed: number[];
        }) => {
          const awarenessStates = yAwareness.getStates();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          changes.added.forEach((clientId) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const state = awarenessStates.get(clientId)?.user;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const color = state?.color;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            const username = state?.name;
            const cursorStyleElem = document.head.appendChild(
              document.createElement("style"),
            );

            cursorStyleElem.innerHTML = `.yRemoteSelectionHead-${clientId} { border-left: ${color} solid 2px;}`;
            const highlightStyleElem = document.head.appendChild(
              document.createElement("style"),
            );

            highlightStyleElem.innerHTML = `.yRemoteSelection-${clientId} { background-color: ${color}9A;}`;
            const styleElem = document.head.appendChild(
              document.createElement("style"),
            );

            styleElem.innerHTML = `.yRemoteSelectionHead-${clientId}::after { transform: translateY(5); margin-left: 5px; border-radius: 5px; opacity: 80%; background-color: ${color}; color: black; content: '${username}'}`;
          });
        },
      );

      // create the monaco binding to the yjs doc
      new MonacoBinding(
        yDocTextMonaco,
        editor?.getModel() || monaco.editor.createModel("", "javaScript"),
        // @ts-expect-error TODO: fix this
        new Set([editor]),
        yAwareness,
      );
    }

    return () => {
      if (!monaco) {
        return;
      }
      monaco.editor.getModels().forEach((editor) => editor.dispose());
    };
  }, [monaco]);

  return (
    <div className="flex flex-col">
      <button
        style={{
          alignSelf: "end",
          padding: "8px 16px",
          marginBottom: "8px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={executeCode}
      >
        Run Code
      </button>
      <Editor
        height="55vh"
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
