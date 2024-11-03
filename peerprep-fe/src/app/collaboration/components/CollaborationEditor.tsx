'use client';

import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { editor as MonacoEditor } from 'monaco-editor';
import { OnMount } from '@monaco-editor/react';
import { useAuthStore } from '@/state/useAuthStore';
import Avatar, { genConfig } from 'react-nice-avatar';
import CodeEditor from './CodeEditor';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { AwarenessState, ConnectedClient } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { useCollaborationStore } from '@/state/useCollaborationStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { stringToColor } from '@/lib/utils';

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
  const { user } = useAuthStore();
  const [connectedClients, setConnectedClients] = useState<
    Map<number, ConnectedClient>
  >(new Map());
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const prevClientsRef = useRef<Map<number, ConnectedClient>>(new Map());
  const sockServerURI =
    process.env.NEXT_PUBLIC_SOCK_SERVER_URL || 'ws://localhost:4444';
  const { toast } = useToast();
  const { clearLastMatchId } = useCollaborationStore();
  const router = useRouter();

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
        const newClients = new Map<number, ConnectedClient>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        states.forEach((value: { [x: string]: any }, clientId: number) => {
          const state = value as AwarenessState;
          if (state.client) {
            newClients.set(clientId, {
              id: state.client,
              user: state.user,
            });
          }
        });

        // Check for new connections
        const newConnectedUsers = Array.from(newClients.values())
          .filter(
            (client) =>
              !prevClientsRef.current.has(client.id) &&
              client.id.toString() !== user?.id,
          )
          .map((client) => client.user.name);

        if (newConnectedUsers.length > 0) {
          const description =
            newConnectedUsers.length === 1
              ? `${newConnectedUsers[0]} joined the session`
              : `${newConnectedUsers.slice(0, -1).join(', ')} and ${newConnectedUsers.slice(
                  -1,
                )} joined the session`;

          toast({
            title: 'User Connected!',
            description,
            variant: 'success',
          });
        }

        // Check for disconnections
        Array.from(prevClientsRef.current.values()).forEach((prevClient) => {
          if (
            !Array.from(newClients.values()).some(
              (client) => client.id === prevClient.id,
            ) &&
            prevClient.id.toString() !== user?.id
          ) {
            toast({
              title: 'User Disconnected',
              description: `${prevClient.user.name} left the session`,
              variant: 'warning',
            });
          }
        });

        prevClientsRef.current = newClients;
        setConnectedClients(newClients);
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

  const handleLeaveSession = () => {
    clearLastMatchId(); // now users last match id will be null
    router.push('/');
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        </div>

        <div className="flex items-center gap-4">
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="border border-amber-700/50 bg-amber-950/90 text-amber-100 hover:bg-amber-900/90"
              >
                Leave Session
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Leave Collaboration Session?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave this session? Any unsaved
                  progress will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLeaveSession}
                  className="border border-amber-700/50 bg-amber-950/90 text-amber-100 hover:bg-amber-900/90"
                >
                  Leave Session
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <CodeEditor onMount={handleEditorMount} language={language} />
    </>
  );
};

export default CollaborationEditor;
