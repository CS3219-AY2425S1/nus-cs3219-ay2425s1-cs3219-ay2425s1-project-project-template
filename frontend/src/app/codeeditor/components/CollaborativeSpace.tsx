"use client"

import React, { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco'
import CodeEditor from '@/app/codeeditor/components/CodeEditor';
import Chat from '@/app/codeeditor/components/chat';
import Editor from '@monaco-editor/react'
import { useRouter } from 'next/navigation';
import axios from "axios";
import { Button } from "@/components/ui/button";

interface CollaborativeSpaceProps {
  initialCode?: string;
  language?: string;
  theme?: 'light' | 'vs-dark';
  roomId: string;
  userName: string;
}

const CollaborativeSpace: React.FC<CollaborativeSpaceProps> = ({
  initialCode = '',
  language = 'javascript',
  theme = 'light',
  roomId,
  userName,
}) => {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const [editor, setEditor] = useState<any | null>(null)
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [binding, setBinding] = useState<MonacoBinding | null>(null);
  const router = useRouter(); // For navigation
  const [codeValue, setCodeValue] = useState(initialCode); // To store code from editor
  const [output, setOutput] = useState(''); // To display output from running code
  const [hasRunCode, setHasRunCode] = useState(false);
  
  useEffect(() => {
    // websocket link updated 
    const provider = new WebsocketProvider('ws://localhost:5004', roomId, ydoc);
    setProvider(provider);
+
    // Set user awareness
    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });

    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc]);

  if (provider === null || ydoc === null) {
    return <div>Loading...</div>;
  }

    // Function to handle exit room
    const handleExitRoom = () => {
      provider?.destroy();
      ydoc?.destroy();
      router.push('/explore'); // Replace with the route you want to navigate to
    };
  
    // Function to handle running code
    const handleRunCode = async () => {
      setHasRunCode(true);
      try {
        const response = await axios.post('/api/run-code', {
          code: codeValue,
          language,
        });
        setOutput(response.data.output);
      } catch (error) {
        console.error('Error running code:', error);
        setOutput('An error occurred while running the code.');
      }
    };
  
    // Function to handle submitting code
    const handleSubmitCode = async () => {
      try {
        const response = await axios.post('/api/submit-code', {
          code: codeValue,
          language,
          roomId,
          userName,
        });
        // Handle the response as needed
        console.log('Code submitted successfully:', response.data);
      } catch (error) {
        console.error('Error submitting code:', error);
      }
    }

  return (
    <div className='flex flex-col h-screen w-full gap-2'>
      <Button variant="destructive" className="flex justify-start ml-2 mt-4 w-fit" type="button" onClick={handleExitRoom}>Leave room</Button>
      <div className="flex h-4/5 w-4/5 gap-4 pt-1 pl-1 mx-auto overflow-hidden">
        <div className='w-3/5'>
          <CodeEditor
            ydoc={ydoc}
            provider={provider}
            initialCode={initialCode}
            language={language}
            theme={theme}
          />
        </div>
        <div className='w-1/4'>
          <Chat ydoc={ydoc} provider={provider} userName={userName} />
        </div>
      </div>
      <div className='flex w-3/4 justify-end'>
          <Button variant="secondary" type="button" onClick={handleRunCode}>Run Code</Button>
          <Button variant="default" type="submit" onClick={handleSubmitCode}>Submit</Button>
      </div>
      {hasRunCode && <div>
        the output that will be shown through testcases etc
      </div>}
    </div>
  );
};
export default CollaborativeSpace;