import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import { Extension, useCodeMirror } from '@uiw/react-codemirror';
import { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view'; // Make sure to import EditorView

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
  const editorRef = useRef<EditorView | null>(null); // Ensure it's either EditorView or null

  const { setContainer, view } = useCodeMirror({
    value: code,
    theme: customSublime,
    extensions,
    onChange: setCode, // Directly use setCode for onChange
    onUpdate: (update) => {
      if (update.state) {
        const cursorPos = update.state.selection.main.head; // Get cursor position
        console.log(`Cursor Position: Line ${cursorPos.line + 1}, Ch ${cursorPos.ch + 1}`);
      }
    },
  });

  // Store the view only if it is defined
  useEffect(() => {
    if (view) {
      editorRef.current = view;
    }
  }, [view]); // Update editorRef only when view changes

  return (
    <div ref={setContainer} className={classes.codeMirrorContainer}>
      {/* CodeMirror will be rendered here automatically */}
    </div>
  );
}

export default CodeEditor;
