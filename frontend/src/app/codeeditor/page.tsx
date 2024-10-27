"use client"

import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';


const CodingPage: React.FC = () => {
  const initialCode = `function helloWorld() {
    console.log('Hello, world!');
    }
    helloWorld();`;
    const [code, setCode] = useState(initialCode);

    // NEED TO EDIT THIS TO SOME COMBINATION THAT WILL GENERATE UNIQUE ROOM ID
    // CAN CONSIDER USING CONCAT(USER1ID, USER2ID) WHERE USER1ID < USER2ID
    const roomId = 'my-unique-room-id';
    const runCode = () => {
        try {
        // eslint-disable-next-line no-eval
        const output = eval(code);
        console.log(output);
        } catch (error) {
        console.error(error);
        }
    };
    return (
    <div className="coding-page-container p-16 border border-red-900 w-full">
      <h1 className="text-2xl font-bold mb-4">Coding Practice</h1>
      <CodeEditor initialCode={initialCode} language="javascript" theme="vs-dark" roomId={roomId} />
      
      <div className="mt-4">
        <Button onClick={runCode}>Run Code</Button>
      </div>
    </div>
  );
};

export default CodingPage;