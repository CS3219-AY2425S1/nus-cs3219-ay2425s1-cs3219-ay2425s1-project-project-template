/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";

export default function MonacoEditor() {
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId") || "anonymous";
  const roomId = searchParams.get("roomId") || "room";

  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("use effect triggered");

    if (!editorRef) return;

    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new WebsocketProvider(
      `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
      roomId,
      yDoc
    );

    // Attaching Yjs to Monaco
    const binding = new MonacoBinding(
      yText,
      editorRef.getModel() as editor.ITextModel,
      new Set([editorRef]),
      yProvider.awareness
    );

    setIsConnected(yProvider.wsconnected);

    return () => {
      yDoc.destroy();
      binding.destroy();
    };
  }, [editorRef]);

  const handleEditorOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  return (
    <div className="flex flex-col w-full h-screen">
      <h1>
        Monaco Editor with Yjs {isConnected ? "connected" : "disconnected"}
      </h1>
      <p>Room: {roomId}</p>
      <p>User: {userId}</p>
      <Editor
        height="90vh"
        defaultLanguage="yaml"
        defaultValue={`a: 2\nb: a + 30`}
        onMount={handleEditorOnMount}
      />
    </div>
  );
}
