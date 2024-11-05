import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  onMount: OnMount;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onMount, language }) => {
  return (
    <div
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      }}
      className="flex-grow overflow-y-auto bg-gray-900 font-mono text-gray-100"
    >
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme="vs-dark"
        onMount={onMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          lineNumbers: 'on',
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
