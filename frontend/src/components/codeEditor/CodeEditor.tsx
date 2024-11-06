import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  viewUpdateRef: React.MutableRefObject<ViewUpdate | null>;
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

function CodeEditor({
  code,
  setCode,
  extensions,
  viewUpdateRef,
}: CodeEditorProps) {

  const updateViewUpdateRef = (viewUpdate: ViewUpdate) => { 
    viewUpdateRef.current = viewUpdate;
  }

  return (
    <CodeMirror
      value={code}
      theme={customSublime}
      className={classes.codeMirror}
      extensions={extensions}
      onChange={setCode}
      onUpdate={updateViewUpdateRef}
    />
  );
}

export default CodeEditor;
