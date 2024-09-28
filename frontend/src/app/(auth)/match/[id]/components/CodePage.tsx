import React from 'react';
import { Monaco } from '@monaco-editor/react';

const CodePage = () => {
  return (
    <Monaco
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// Write your code here"
    />
  );
};

export default CodePage;
