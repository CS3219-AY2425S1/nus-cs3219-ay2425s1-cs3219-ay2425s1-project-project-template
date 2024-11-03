"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import MonacoEditor from '@monaco-editor/react';
import { debounce } from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/api-user';

interface CodeEditorProps {
  sessionId: string;
  questionId: string;
  initialLanguage?: string;
}

const CollaborativeEditor = ({ sessionId, questionId, initialLanguage = 'javascript' }: CodeEditorProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState(initialLanguage);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  // Initialize socket connection
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      try {
        const res = await verifyToken(token) as { data: { username: string, email: string } }
        const username = res.data.username;
        return username
        console.log('User name is', username);
      } catch (error) {
        console.error('Token verification failed:', error)
        router.push('/login')
      }
    }

    let socketInstance: Socket;

    fetchUserData().then((username) => {
      if (!username) {
        console.log('Username not found');
        router.push('/login')
        return;
      }
      socketInstance = io(process.env.NEXT_PUBLIC_COLLAB_API_URL, {
        query: {
          sessionId,
          questionId,
          userId: username,
        },
      });

      socketInstance.on('connect', () => {
        setIsConnected(true);
        setError('');
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        setError('Disconnected from server');
      });

      socketInstance.on('error', (errorMessage: string) => {
        setError(errorMessage);
      });

      socketInstance.on('codeChange', ({ code: newCode, language: newLanguage }) => {
        setCode(newCode);
        setLanguage(newLanguage);
      });

      socketInstance.on('activeUsers', (users: string[]) => {
        setActiveUsers(users);
      });

      socketInstance.on('submissionMade', ({ timestamp }) => {
        console.log(`Code submitted at ${timestamp}`);
      });

      setSocket(socketInstance);
    });

    return () => {
      socketInstance?.disconnect();
    };

  }, [sessionId, questionId]);

  // Debounced code change handler
  const debouncedCodeChange = useCallback(
    debounce((newCode: string, newLanguage: string) => {
      if (socket?.connected) {
        socket.emit('codeChange', {
          sessionId,
          questionId,
          code: newCode,
          language: newLanguage,
        });
      }
    }, 400),
    [socket, sessionId, questionId]
  );

  // Handle code changes
  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
      debouncedCodeChange(newCode, language);
    }
  };

  // Handle code submission
  const handleSubmit = () => {
    if (socket?.connected) {
      socket.emit('submitCode', {
        sessionId,
        questionId,
        code,
        language,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Collaborative Code Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Badge variant="secondary">
                <Users className="w-4 h-4 mr-1" />
                {activeUsers.length} users
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="min-h-[500px] border rounded-md overflow-hidden">
            <MonacoEditor
              height="500px"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={!isConnected}
            >
              Submit Code
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborativeEditor;