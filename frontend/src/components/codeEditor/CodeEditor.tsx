import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension } from '@uiw/react-codemirror';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  readOnly?: boolean;
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

function CodeEditor({ code, setCode, extensions, readOnly=false }: CodeEditorProps) {
  return (
    <CodeMirror
      value={code}
      theme={customSublime}
      className={classes.codeMirror}
      extensions={extensions}
      onChange={setCode}
      readOnly={readOnly}
    />
  );
}

export default CodeEditor;
