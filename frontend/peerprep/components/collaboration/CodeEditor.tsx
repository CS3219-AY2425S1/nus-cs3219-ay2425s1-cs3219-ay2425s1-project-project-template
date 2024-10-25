"use client";
import { useRef, useState, useEffect } from "react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import * as Y from "yjs";
import { socket } from "../../services/sessionSocketService";
import { SupportedLanguages } from "../../utils/utils";
import { useTheme } from "next-themes";
import { Editor } from "@monaco-editor/react";

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
        resolvedSocket?.off("updateContent");
        resolvedSocket?.off("updateLanguage");
      })();
    };
  }, []);

  return (
    <div className="flex h-full w-full gap-4">
      {/* <div className="flex width-1/2 h-full"> */}
      {/* <LanguageSelector language={language} onSelect={onSelect} /> */}
      <Editor
        className="flex min-h-[250px] w-full"
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        language={language}
        onMount={onMount}
        value={value}
      />
      {/* </div> */}
      {/* <Output editorRef={editorRef} language={language} /> */}
    </div>
  );
}
