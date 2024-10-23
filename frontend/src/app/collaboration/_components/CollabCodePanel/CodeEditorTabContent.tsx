"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import draculaTheme from "monaco-themes/themes/Dracula.json";
import Editor, { Monaco } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";

export default function CodeEditorTabContent() {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [provider, setProvider] = useState<WebsocketProvider>();

  useEffect(() => {
    if (!editorRef) return;

    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new WebsocketProvider(
      `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
      "cs3219", // session id
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
  }, [editorRef]);

  const handleEditorOnMount = useCallback(
    (e: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      // @ts-expect-error: we ignore since monaco-theme library is outdated with the latest
      // monaco expected theme types but it still works
      monaco.editor.defineTheme("dracula", draculaTheme);
      monaco.editor.setTheme("dracula");
      setEditorRef(e);
    },
    []
  );

  return (
    <div className="h-full overflow-scroll">
      {provider ? <InjectableCursorStyles yProvider={provider} /> : null}
      <Editor
        defaultValue={"class Solution {\n" + "  \n" + "}"}
        onMount={handleEditorOnMount}
        height={"100%"}
        width={"100%"}
        theme="dracula"
        language={"java"}
        options={{
          tabSize: 4,
          padding: { top: 20 },
        }}
      />
    </div>
  );
}

interface InjectableCursorStylesProps {
  yProvider: WebsocketProvider;
}

interface AwarenessUser {
  name: string;
  color: string;
}

type AwarenessList = [number, AwarenessUser][];

function InjectableCursorStyles({ yProvider }: InjectableCursorStylesProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([]);

  // Set up current user's presence and also update whenever remote client submits its own presence
  useEffect(() => {
    const awareness = yProvider.awareness;

    // TODO: make this dynamic with the context api and choose random hex colors
    awareness.setLocalStateField("user", {
      name: "Jm San Diego",
      color: "#FF8C00",
    });

    const updateAwarenessUsers = () => {
      const states = awareness.getStates(); // Get all user states
      const users: AwarenessList = [];
      states.forEach((val, key) => {
        users.push([key, val.user]);
      });

      setAwarenessUsers(users);
    };

    // Attach change event listener
    awareness.on("change", updateAwarenessUsers);
    updateAwarenessUsers();

    return () => {
      awareness.off("change", updateAwarenessUsers);
    };
  }, [yProvider]);

  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    awarenessUsers.forEach((client, _idx) => {
      console.log(client, client[0], client[1]);
      cursorStyles += `
          .yRemoteSelection-${client[0]},
          .yRemoteSelectionHead-${client[0]}  {
            --user-color: ${client[1].color};
          }

          .yRemoteSelectionHead-${client[0]}::after {
            content: "${client[1].name}";
          }
        `;
    });

    return { __html: cursorStyles };
  }, [awarenessUsers]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
