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

  const [otherUser, setOtherUser] = useState<string>();

  useEffect(() => {
    if (!editorRef) {
      return;
    }

    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new WebsocketProvider(
      `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
      roomId,
      yDoc,
      {
        params: {
          name: "aaauser-" + userId,
        },
      }
    );

    // Attaching Yjs to Monaco
    const binding = new MonacoBinding(
      yText,
      editorRef.getModel() as editor.ITextModel,
      new Set([editorRef]),
      yProvider.awareness
    );

    setIsConnected(yProvider.wsconnected);

    // Listen for other users joining or leaving the session
    yProvider.awareness.on("update", ({ added }: { added: number[] }) => {
      // Can have an array or map for otherUser
      // Add the new user to the list of users
      // In our style sheet, we can map each user to a color
      // Ideally should communicate with the backend to get the user's color
      // User joined room, check added, assign color to user
      const states = yProvider.awareness.getStates();

      console.log(states);

      if (added.length > 0) {
        const newUser = String(added[0]);
        if (newUser) {
          setOtherUser(newUser);
          console.log(`User joined: ${newUser}`);
        }
      }
    });

    return () => {
      yDoc.destroy();
      yProvider.disconnect();
      binding.destroy();
    };
  }, [editorRef]);

  const handleEditorOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    if (!window) {
      return;
    }
    setEditorRef(e);
  }, []);

  return (
    <>
      {otherUser && (
        <style>
          {`.yRemoteSelectionHead-${otherUser} {
                border-left: blue solid 2px;
                border-top: blue solid 2px;
                border-bottom: blue solid 2px;
              }

              .yRemoteSelectionHead-${otherUser}::after {
                border: blue 3px solid;
              }`}
        </style>
      )}
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
    </>
  );
}
