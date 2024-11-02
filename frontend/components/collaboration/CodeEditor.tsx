import { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
// import { WebsocketProvider } from 'y-websocket';
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";

interface CodeEditorProps {
  roomId: string;
}
var randomColor = require("randomcolor"); // import the script

export default function CodeEditor({ roomId }: CodeEditorProps) {
  const codeEditorRef = useRef<editor.IStandaloneCodeEditor>();
  const monaco = useMonaco();

  // read room Id here:

  // read userContext here

  // Runs once when the component mounts to set the initial language.
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (monaco) {
        // create a yew yjs doc
        const ydoc = new Y.Doc();
        // establish partykit as your websocket provider
        const provider = new WebsocketProvider(
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
              console.log(awarenessStates);
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
    }

    return () => {
      if (!monaco) {
        return;
      }
      monaco.editor.getModels().forEach((editor) => editor.dispose());
    };
  }, [monaco]);

  return (
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
    />
  );
}
