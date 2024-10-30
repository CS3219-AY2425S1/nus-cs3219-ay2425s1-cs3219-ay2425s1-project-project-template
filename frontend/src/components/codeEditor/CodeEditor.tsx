import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, EditorView } from '@uiw/react-codemirror'; // Import EditorView from CodeMirror
import { useRef } from 'react';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

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
  const editorRef = useRef<EditorView | null>(null); // Reference for the EditorView

  const handleChange = (value: string) => {
    setCode(value);
    
    // Find the current cursor position
    if (editorRef.current) {
      const cursorPos = editorRef.current.state.selection.main.head; // Get the cursor position
      const line = editorRef.current.state.doc.lineAt(cursorPos).number; // Get the line number
      const ch = cursorPos - editorRef.current.state.doc.lineAt(line - 1).from; // Get character position
      console.log(`Cursor Position: Line ${line}, Ch ${ch + 1}`); // Log cursor position
    }
  };

  return (
    <CodeMirror
      value={code}
      theme={customSublime}
      className={classes.codeMirror}
      extensions={extensions}
      onChange={handleChange} // Use handleChange to log cursor position
      ref={editorRef} // Attach ref to the CodeMirror component
    />
  );
}

export default CodeEditor;
