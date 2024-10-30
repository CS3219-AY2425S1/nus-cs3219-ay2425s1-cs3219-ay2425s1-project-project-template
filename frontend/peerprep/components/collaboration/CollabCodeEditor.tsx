"use client";

import { useRef, useState, useEffect } from "react";
import * as Y from "yjs";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Card } from "@nextui-org/react";

import { SupportedLanguages } from "../../utils/utils";
import { socket } from "../../services/sessionService";

import Output from "./Output";
import LanguageSelector from "./LanguageSelector";

interface CollabCodeEditorProps {
  language: SupportedLanguages;
  yDoc: Y.Doc;
  propagateUpdates: (
    docUpdate?: Uint8Array,
    languageUpdate?: SupportedLanguages,
    codeOutput?: string
  ) => void;
}

export default function CollabCodeEditor({
  language,
  yDoc,
  propagateUpdates,
}: CollabCodeEditorProps) {
  const { theme } = useTheme();
  const yText = yDoc.getText("code");
  const editorRef = useRef<any>(null);

  const onMount = async (editor: any) => {
    editorRef.current = editor;
    const model = editor.getModel();

    if (model) {
      const MonacoBinding = (await import("y-monaco")).MonacoBinding; // not dynamically importing this causes an error
      const binding = new MonacoBinding(yText, model, new Set([editor]));
    }

    yDoc.on("update", async (update: Uint8Array) => {
      propagateUpdates(update);
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
