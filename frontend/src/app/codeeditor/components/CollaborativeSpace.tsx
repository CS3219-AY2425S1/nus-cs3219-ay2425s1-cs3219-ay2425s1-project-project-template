"use client"

import React, { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco'
import CodeEditor from '@/app/codeeditor/components/CodeEditor';
import Chat from '@/app/codeeditor/components/chat';
import Editor from '@monaco-editor/react'
import VideoCall from '@/app/codeeditor/components/VideoCall';

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

  useEffect(() => {
    // websocket link updated 
    const provider = new WebsocketProvider('ws://localhost:5004', roomId, ydoc);
    setProvider(provider);

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

  return (
    <div className="flex h-screen w-4/5 gap-4 p-1 mx-auto overflow-hidden">
      <div className='w-2/3'>
        <CodeEditor
          ydoc={ydoc}
          provider={provider}
          initialCode={initialCode}
          language={language}
          theme={theme}
        />
      </div>
      <div className='w-1/3 flex flex-col gap-4'>
        <div className='h-1/2'>
        <VideoCall 
            userName={userName} 
            roomId={roomId}
          />
        </div>
        <div className='h-1/2'>
          <Chat ydoc={ydoc} provider={provider} userName={userName} />
        </div>
      </div>
    </div>
  );
};
export default CollaborativeSpace;