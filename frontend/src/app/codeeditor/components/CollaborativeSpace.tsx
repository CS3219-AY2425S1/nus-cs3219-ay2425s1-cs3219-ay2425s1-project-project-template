"use client"

import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import CodeEditor from '@/app/codeeditor/components/CodeEditor';
import Chat from '@/app/codeeditor/components/chat';

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
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // NEED TO UPDATE THIS
    const provider = new WebsocketProvider('ws://localhost:1234', roomId, ydoc);
    providerRef.current = provider;

    // Set user awareness
    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId, userName]);

  if (!ydocRef.current || !providerRef.current) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collaborative-coding-page" style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 2 }}>
        <CodeEditor
          ydoc={ydocRef.current}
          provider={providerRef.current}
          initialCode={initialCode}
          language={language}
          theme={theme}
        />
      </div>
      <div style={{ flex: 1, marginLeft: '10px' }}>
        <Chat ydoc={ydocRef.current} provider={providerRef.current} userName={userName} />
      </div>
    </div>
  );
};
export default CollaborativeSpace;