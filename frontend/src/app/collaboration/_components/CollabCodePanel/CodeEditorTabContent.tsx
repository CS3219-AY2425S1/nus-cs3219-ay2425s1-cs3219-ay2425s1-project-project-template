"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditorTabContent() {
  const [value, setValue] = useState("a {\n     new\n}");

  return (
    <div className="h-full overflow-scroll">
      <Editor value={value} height={"100%"} width={"100%"} theme="vs-dark" language={"java"}/>
    </div>
  );
}
