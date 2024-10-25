"use client";

import { useCallback, useEffect, useState } from "react";
import draculaTheme from "monaco-themes/themes/Dracula.json";
import Editor, { Monaco } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";
import InjectableCursorStyles from "./InjectableCursorStyles";
import { UserProfile } from "@/types/User";

interface CollaborativeEditorProps {
  sessionId: string;
  currentUser: UserProfile;
  language?: string;
  themeName?: string;
}

export default function CollaborativeEditor({
  sessionId,
  currentUser,
  language = "typescript",
  themeName = "dracula",
}: CollaborativeEditorProps) {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [provider, setProvider] = useState<WebsocketProvider>();

  useEffect(() => {
    if (!editorRef) return;

    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new WebsocketProvider(
      `ws://localhost:1234/yjs?sessionId=${sessionId}`,
      sessionId,
      yDoc
    );
    setProvider(yProvider);

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
  }, [sessionId, editorRef]);

  const handleEditorOnMount = useCallback(
    (e: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      // @ts-expect-error: we ignore since monaco-theme library is outdated with the latest
      // monaco expected theme types but it still works
      monaco.editor.defineTheme(themeName, draculaTheme);
      monaco.editor.setTheme(themeName);
      setEditorRef(e);
    },
    [themeName]
  );

  return (
    <div className="w-full h-full overflow-scroll">
      {provider && (
        <InjectableCursorStyles
          yProvider={provider}
          cursorName={currentUser.username}
          cursorColor={"#0096C7"}
        />
      )}
      <Editor
        defaultValue={"class Solution {\n" + "  \n" + "}"}
        onMount={handleEditorOnMount}
        height={"100%"}
        width={"100%"}
        theme={themeName}
        language={language}
        options={{
          tabSize: 4,
          padding: { top: 20 },
        }}
      />
    </div>
  );
}
