"use client";

import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";

export default function CodeEditorTabContent() {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    console.log("use effect triggered");
    
    if (!editorRef) return;
    
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new WebsocketProvider(
      `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
      "cs3219",
      yDoc
    );

    // Attaching Yjs to Monaco
    const binding = new MonacoBinding(
      yText,
      editorRef?.getModel() as editor.ITextModel,
      new Set([editorRef]),
      yProvider.awareness
    );

    return () => {
      yDoc.destroy();
      binding.destroy();
    };
  }, [editorRef]);

  const handleEditorOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, [editorRef]);

  return (
    <div className="h-full overflow-scroll">
      <Editor
        onMount={handleEditorOnMount}
        height={"100%"}
        width={"100%"}
        theme="vs-dark"
        language={"java"}
      />
    </div>
  );
}
