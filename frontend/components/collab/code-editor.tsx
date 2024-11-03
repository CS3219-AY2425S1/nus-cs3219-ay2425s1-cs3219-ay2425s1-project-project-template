"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor as MonacoEditor } from "monaco-types";
import Editor, { useMonaco } from "@monaco-editor/react";

interface LanguageEntry {
  language: string;
  value: string;
}

const languages: Record<string, LanguageEntry> = {
  Javascript: {
    language: "javascript",
    value: "// some comment",
  },
  Python: {
    language: "python",
    value: "# some comment",
  },
  Java: {
    language: "java",
    value: "// some comment",
  },
  "C++": {
    language: "cpp",
    value: "// some comment",
  },
};

export default function CodeEditor({ roomId }: { roomId: string }) {
  const monaco = useMonaco();
  const [language, setLanguage] = useState<string>("Javascript");
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] =
    useState<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const languageMap = useMemo(() => ydoc.getMap("language"), [ydoc]);

  // this effect manages the lifetime of the Yjs document and the provider
  useEffect(() => {
    const provider = new WebsocketProvider(
      "ws://localhost:3002/yjs",
      roomId,
      ydoc
    );
    console.log(provider);
    setProvider(provider);
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc, roomId]);

  // this effect manages the lifetime of the editor binding
  useEffect(() => {
    if (provider == null || editor == null) {
      console.log(provider, editor);
      return;
    }
    const monacoBinding = new MonacoBinding(
      ydoc.getText(),
      editor.getModel()!,
      new Set([editor]),
      provider?.awareness
    );
    return () => {
      monacoBinding.destroy();
    };
  }, [ydoc, provider, editor]);

  // Sync language changes across clients
  useEffect(() => {
    // Update language when languageMap changes
    const handleLanguageChange = () => {
      const newLanguage = languageMap.get("selectedLanguage") as string;
      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage);
      }
    };
    languageMap.set("selectedLanguage", language);
    languageMap.observe(handleLanguageChange);
    return () => {
      languageMap.unobserve(handleLanguageChange);
    };
  }, [languageMap, language]);

  // Apply language change in the editor model
  useEffect(() => {
    if (editor && monaco) {
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, languages[language]?.language);
      }
    }
  }, [language, editor, monaco]);

  return (
    <div className="w-3/5 p-4">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="h-1/8 mb-4 flex justify-between items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-1/5">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(languages).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 h-7/5">
            <Editor
              value={languages[language]?.value}
              language={languages[language]?.language}
              onMount={(editor) => {
                setEditor(editor);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
