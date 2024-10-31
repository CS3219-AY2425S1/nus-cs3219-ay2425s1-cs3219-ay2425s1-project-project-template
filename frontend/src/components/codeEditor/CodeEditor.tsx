import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { useRef, useState } from 'react';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  setCodewithCursor: (newCode: string) => void;
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
    editorView.current = viewUpdate.view;
    if (viewUpdate.state.selection.main) {
      const { from, to } = viewUpdate.state.selection.main;
      setCursorPos({ anchor: from, head: to });
    }
  };

  // Expose a method to allow external calls
  const setCodewithCursor = (newCode: string) => {
    // Call the external setCodewithCursor function
    setCode(newCode);

    // Keep the cursor position in sync
    const doc = editorView.current?.state.doc;
    if (doc && editorView.current) {
      const maxPos = doc.length;
      const validAnchor = Math.min(cursorPos.anchor, maxPos);
      const validHead = Math.min(cursorPos.head, maxPos);
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
