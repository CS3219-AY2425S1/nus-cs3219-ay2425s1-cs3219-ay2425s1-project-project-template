'use client';

import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { editor as MonacoEditor } from 'monaco-editor';
import { OnMount } from '@monaco-editor/react';
import { useAuthStore } from '@/state/useAuthStore';
import Avatar, { genConfig } from 'react-nice-avatar';
import ProblemCodeEditor from '@/components/problems/ProblemCodeEditor';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';

interface AwarenessUser {
  name: string;
  color: string;
}

interface AwarenessState {
  client: number;
  user: AwarenessUser;
}

interface ConnectedClient {
  id: number;
  user: AwarenessUser;
}

interface CollaborationEditorProps {
  language: string;
  matchId: string | null;
  onLanguageChange: (language: string) => void;
  supportedLanguages: string[];
}

const CollaborationEditor = ({
  language,
  matchId,
  onLanguageChange,
  supportedLanguages,
}: CollaborationEditorProps) => {
  console.log('language', language); // this is not used yet atm
  const { user } = useAuthStore();
  const [connectedClients, setConnectedClients] = useState<
    Map<number, ConnectedClient>
  >(new Map());
  const [, setDisconnectionAlert] = useState<string | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const sockServerURI =
    process.env.NEXT_PUBLIC_SOCK_SERVER_URL || 'ws://localhost:4444';

  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash).toString(16).substring(0, 6);
    return `#${'0'.repeat(6 - color.length)}${color}`;
  };

  const handleEditorMount: OnMount = (editor) => {
    if (!matchId) {
      console.error('Cannot mount editor: Match ID is undefined');
      return;
    }
    editorRef.current = editor;
    const doc = new Y.Doc();
    providerRef.current = new WebsocketProvider(sockServerURI, matchId, doc);
    const type = doc.getText('monaco');

    providerRef.current.awareness.setLocalState({
      client: user?.id,
      user: {
        name: user?.username,
        color: stringToColor(user?.id || ''),
      },
    });

    providerRef.current.awareness.on('change', () => {
      const states = providerRef.current?.awareness.getStates();
      if (states) {
        const clients = new Map<number, ConnectedClient>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        states.forEach((value: { [x: string]: any }, clientId: number) => {
          const state = value as AwarenessState;
          if (state.client) {
            clients.set(clientId, {
              id: state.client,
              user: state.user,
            });
          }
        });
        setConnectedClients(clients);
      }
    });

    providerRef.current.on('status', ({ status }: { status: string }) => {
      if (status === 'disconnected') {
        setDisconnectionAlert('A user has disconnected from the room');
        setTimeout(() => setDisconnectionAlert(null), 3000);
      }
    });

    const model = editorRef.current?.getModel();
    if (editorRef.current && model) {
      bindingRef.current = new MonacoBinding(
        type,
        model,
        new Set([editorRef.current]),
        providerRef.current.awareness,
      );
    }
  };

  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }

      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }

      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {Array.from(connectedClients.values()).map((client) => (
            <Button
              key={client.id}
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
              title={client.user.name}
              style={{ outline: `2px solid ${client.user.color}` }}
            >
              <div className="h-full w-full scale-x-[-1] transform">
                <Avatar
                  style={{ width: '100%', height: '100%' }}
                  {...genConfig(client.user.name)}
                />
              </div>
            </Button>
          ))}
        </div>
      </div>
      <ProblemCodeEditor onMount={handleEditorMount} />
    </>
  );
};

export default CollaborationEditor;
