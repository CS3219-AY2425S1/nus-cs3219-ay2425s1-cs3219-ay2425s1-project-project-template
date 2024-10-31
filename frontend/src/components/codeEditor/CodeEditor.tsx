import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';
import { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

function CodeEditor({ code, setCode, extensions }: CodeEditorProps) {
  const cursorPosition = useRef({ line: 0, ch: 0 });

  const handleUpdate = (viewUpdate: ViewUpdate) => {
    if (viewUpdate.state.selection.main) {
      const { from } = viewUpdate.state.selection.main;
      const line = viewUpdate.state.doc.lineAt(from).number;
      const ch = from - viewUpdate.state.doc.line(line).from;
      cursorPosition.current = { line, ch };
      console.log("Cursor Position:", cursorPosition.current); // Logs position
    }
  };

  return (
    <CodeMirror
      value={code}
      theme={customSublime}
      className={classes.codeMirror}
      extensions={extensions}
      onChange={setCode}
      onUpdate={handleUpdate}
    />
  );
}

export default CodeEditor;
