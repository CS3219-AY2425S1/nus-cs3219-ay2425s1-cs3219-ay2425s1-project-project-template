import React, { useState } from 'react';
import './App.css'; // Import your CSS file here
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from '@codemirror/lang-python'; // Import the Python language mode

function App() {
  const code = "console.log('Code Mirror!');";
  return (
    <div>
      <div className="headerStyle">
        Python code editor 
      </div>
      <CodeMirror
        value={code}
        width="60vw"
        theme={vscodeDark}
        extensions={[python()]}
        className="codeMirrorStyle"
      />
    </div>
  );
}
export default App;
