// hooks/useCollaboration.ts
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ConsoleOutput, ProgrammingLanguage } from '../pages/Collaboration/collaborationInterface';

interface CollaborationState {
  code: string;
  language: ProgrammingLanguage;
  messages: ChatMessage[];
  consoleOutput: ConsoleOutput[];
  isConnected: boolean;
}

interface UseCollaborationProps {
  roomId: string;
  userId: string;
  onConnectionError?: (error: Error) => void;
}

export const useCollaboration = ({ 
  roomId, 
  userId, 
  onConnectionError 
}: UseCollaborationProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, setState] = useState<CollaborationState>({
    code: '',
    language: 'C++',
    messages: [],
    consoleOutput: [],
    isConnected: false,
  });

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://your-backend-url/collaboration/${roomId}`);

    ws.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true }));
      // Send join room message
      ws.send(JSON.stringify({
        type: 'join',
        payload: { roomId, userId }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      onConnectionError?.(new Error('WebSocket connection error'));
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId, userId]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'code_update':
        setState(prev => ({ ...prev, code: data.payload }));
        break;
      case 'language_change':
        setState(prev => ({ ...prev, language: data.payload }));
        break;
      case 'chat_message':
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, data.payload]
        }));
        break;
      case 'console_output':
        setState(prev => ({
          ...prev,
          consoleOutput: [...prev.consoleOutput, data.payload]
        }));
        break;
    }
  };

  const sendCode = useCallback((code: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'code_update',
        payload: code
      }));
    }
  }, [socket]);

  const sendMessage = useCallback((content: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'chat_message',
        payload: {
          content,
          sender: userId,
          timestamp: new Date()
        }
      }));
    }
  }, [socket, userId]);

  const changeLanguage = useCallback((language: ProgrammingLanguage) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'language_change',
        payload: language
      }));
    }
  }, [socket]);

  return {
    ...state,
    sendCode,
    sendMessage,
    changeLanguage
  };
};