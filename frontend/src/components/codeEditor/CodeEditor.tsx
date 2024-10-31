import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { useRef, useState } from 'react';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  ifSetCursor?: boolean
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

function CodeEditor({ code, setCode, extensions, ifSetCursor }: CodeEditorProps) {
  const [cursorPos, setCursorPos] = useState({ anchor: 0, head: 0 });
  const editorView = useRef<ViewUpdate['view'] | null>(null); // Store editor view

  const handleUpdate = (viewUpdate: ViewUpdate) => {
    editorView.current = viewUpdate.view;
    if (viewUpdate.state.selection.main) {
      const { from, to } = viewUpdate.state.selection.main;
      setCursorPos({ anchor: from, head: to });
    }
  };

  // Unified function to handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    const doc = editorView.current?.state.doc;
    if (ifSetCursor && doc && editorView.current) {
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
      onChange={handleCodeChange} // Use handleCodeChange for both cases
      onUpdate={handleUpdate}
    />
  );
}

export default CodeEditor;
