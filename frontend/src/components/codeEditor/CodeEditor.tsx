import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { useRef, useState, useEffect } from 'react';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  setCodeHandler?: (handler: (newCode: string) => void) => void; // Expose setCodeHandler
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

function CodeEditor({ code, setCode, extensions, setCodeHandler }: CodeEditorProps) {
  const [cursorPos, setCursorPos] = useState({ anchor: 0, head: 0 });
  const editorView = useRef<ViewUpdate['view'] | null>(null); // Store editor view

  const handleUpdate = (viewUpdate: ViewUpdate) => {
    editorView.current = viewUpdate.view;
    if (viewUpdate.state.selection.main) {
      const { from, to } = viewUpdate.state.selection.main;
      setCursorPos({ anchor: from, head: to });
    }
  };

  const internalSetCodeHandler = (newCode: string) => {
    setCode(newCode);
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

  // Expose internalSetCodeHandler to the parent component if setCodeHandler prop is provided
  useEffect(() => {
    if (setCodeHandler) {
      setCodeHandler(internalSetCodeHandler);
    }
  }, [setCodeHandler]);

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
