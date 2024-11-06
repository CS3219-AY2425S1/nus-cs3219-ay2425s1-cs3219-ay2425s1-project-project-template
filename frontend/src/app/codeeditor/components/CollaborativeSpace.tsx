"use client"

import React, { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco'
import CodeEditor from '@/app/codeeditor/components/CodeEditor';
import Chat from '@/app/codeeditor/components/chat';
import CodeOutput from '@/app/codeeditor/components/CodeOutput';
import Editor from '@monaco-editor/react'
import { useRouter } from 'next/navigation';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CollaborativeSpaceProps } from '../models/types'
import {DUMMY_QUESTION} from '../models/dummies'

const CollaborativeSpace: React.FC<CollaborativeSpaceProps> = ({
  initialCode = '',
  language = 'javascript',
  theme = 'light',
  roomId,
  userName,
  question = DUMMY_QUESTION
}) => {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [codeValue, setCodeValue] = useState(initialCode); // To store code from editor
  const [output, setOutput] = useState(''); // To display output from running code
  const [hasRunCode, setHasRunCode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
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
    <div className='flex w-full h-full'>
      <div className='flex-col w-2/5 p-4'>
        <div className='border rounded-xl h-screen'>
          {/* Header Section */}
        <div className="mb-4">
          <div className="text-sm text-gray-600">You are coding with:</div>
          <div className="text-xl font-semibold text-gray-800">{language}</div>
        </div>

        {/* Question Title and Difficulty */}
        <div className="mb-4">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            Question {question.questionId}: {question.title}
          </h4>
          <div>Difficulty: {question.difficulty}</div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {question.categories.map((category, index) => (
              <span
                key={index}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-700 mt-auto">
          {question.description}
        </div>
          
        </div>
      </div>
      <div className='flex-col w-3/5'>
        <div className='h-2/3 p-4 pb-0 pl-0'>
          <CodeEditor
            ydoc={ydoc}
            provider={provider}
            initialCode={initialCode}
            language={language}
            theme={theme}
          />
        </div>
        <div className='h-1/4 pr-4 pt-2'>
        <div>
          <Button variant={isChatOpen ? "default" : "secondary"} onClick={()=>setIsChatOpen(true)}>Chat</Button>
          <Button variant={isChatOpen ? "secondary" : "default"} onClick={()=>setIsChatOpen(false)}>Run Code</Button>
        </div>
          {isChatOpen 
            ? <Chat ydoc={ydoc} provider={provider} userName={userName} />
            : <CodeOutput outputText={output} handleRunCode={handleRunCode} handleSubmitCode={handleSubmitCode} />}
        </div>
      </div>
    </div>
  );
};
export default CollaborativeSpace;