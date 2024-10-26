"use client";

import { useRef, useState, useEffect } from "react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import * as Y from "yjs";
import { socket } from "../../services/sessionSocketService";
import { SupportedLanguages } from "../../utils/utils";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Card } from '@nextui-org/react';


export default function CodeEditor() {
  const { theme } = useTheme();
  const doc = new Y.Doc();
  const yText = doc.getText("code");
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<SupportedLanguages>(
    "javascript" as SupportedLanguages
  );

  const userChangeRef = useRef<boolean>(false);

  const onMount = async (editor: any) => {
    editorRef.current = editor;
    const model = editor.getModel();
    if (model) {
      const MonacoBinding = (await import("y-monaco")).MonacoBinding; // not dynamically importing this causes an error
      const binding = new MonacoBinding(yText, model, new Set([editor]));
    }

    doc.on("update", async (update: Uint8Array) => {
      const resolvedSocket = await socket;
      resolvedSocket?.emit("update", update);
      console.log("update", update);
    });
  };

  const onSelect = (language: SupportedLanguages) => {
    setLanguage(language);
    (async () => {
      const resolvedSocket = await socket;
      resolvedSocket?.emit("selectLanguage", language);
    })();
  };

  useEffect(() => {
    (async () => {
      const resolvedSocket = await socket;

      resolvedSocket?.on("initialData", (data: any) => {
        const { sessionData } = data;
        const { yDocUpdate } = sessionData;
        Y.applyUpdate(doc, new Uint8Array(yDocUpdate));
      });

      resolvedSocket?.on("updateContent", (update: any) => {
        update = new Uint8Array(update);
        Y.applyUpdate(doc, update);
      });

      resolvedSocket?.on("updateLanguage", (updatedLanguage: string) => {
        setLanguage(updatedLanguage as SupportedLanguages);
      });
    })();

    return () => {
      (async () => {
        const resolvedSocket = await socket;
        resolvedSocket?.off("initialData");
        resolvedSocket?.off("updateContent");
        resolvedSocket?.off("updateLanguage");
      })();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Card className="flex flex-col h-full w-full p-4 gap-4 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col w-full h-3/4">
          <div className="px-4 sm:px-0 mb-2">
            <LanguageSelector language={language} onSelect={onSelect} />
          </div>
          <div className="flex w-full h-full">
            <Editor
              className="flex-1"
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              language={language}
              onMount={onMount}
              value={value}
              options={{ fontSize: 14 }}
            />
          </div>
        </div>
        <div className="flex w-full h-1/4">
          <Output editorRef={editorRef} language={language} />
        </div>
      </Card>
    </div>
  );
}
