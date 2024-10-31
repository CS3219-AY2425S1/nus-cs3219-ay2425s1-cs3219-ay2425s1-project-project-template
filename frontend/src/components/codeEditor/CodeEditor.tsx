import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { useRef, useState } from 'react';

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
  const [cursorPos, setCursorPos] = useState({ anchor: 0, head: 0 });
  const editorView = useRef<ViewUpdate['view'] | null>(null); // Store editor view

  const handleUpdate = (viewUpdate: ViewUpdate) => {
    // Save the editor view for use in handleChange
    editorView.current = viewUpdate.view;

    if (viewUpdate.state.selection.main) {
      const { from, to } = viewUpdate.state.selection.main;
      setCursorPos({ anchor: from, head: to });
    }
  };

  const setCodeHandler = (newCode: string) => {
    // Set new code
    setCode(newCode);

    // Restore cursor position using the stored editor view
    // Check if cursorPos is still valid
    const doc = editorView.current?.state.doc;
    if (doc && editorView.current) {
      const maxPos = doc.length; // Total length of the new document
      const validAnchor = Math.min(cursorPos.anchor, maxPos);
      const validHead = Math.min(cursorPos.head, maxPos);

      // Dispatch the cursor position within valid range
      editorView.current.dispatch({
        selection: { anchor: validAnchor, head: validHead },
      });
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
