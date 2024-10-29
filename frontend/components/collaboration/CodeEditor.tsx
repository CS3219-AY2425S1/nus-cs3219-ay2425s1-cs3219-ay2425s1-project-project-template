import { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
// import { WebsocketProvider } from 'y-websocket';
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebrtcProvider } from "y-webrtc";

var randomColor = require("randomcolor"); // import the script
const RandomColor = randomColor(); // a hex code for an attractive color

export default function CodeEditor() {
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
        const provider = new WebrtcProvider("temp", ydoc);
        // get the text from the monaco editor
        const yDocTextMonaco = ydoc.getText("monaco");
        // get the monaco editor
        const editor = monaco.editor.getEditors()[0];

        // create the monaco binding to the yjs doc
        new MonacoBinding(
          yDocTextMonaco,
          editor.getModel()!,
          // @ts-expect-error TODO: fix this
          new Set([editor]),
          provider.awareness,
        );
      }
    }
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
