import { useState, useEffect, useCallback } from 'react';
import { UserMatchingResponse } from '@/types/types';

type Message = UserMatchingResponse;

export function useWebSocket(url: string, userId: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
      setIsConnected(false);
    }
  }, [ws]);

  useEffect(() => {
    if (!userId) return;

    const baseUrl = url.replace('http://', '');
    const wsUrl = `ws://${baseUrl}/matching/ws?userId=${userId}`;
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    websocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      setLastMessage(JSON.parse(event.data));
    };

    return () => {
      websocket.close();
    };
  }, [url, userId]);

  const sendMessage = useCallback(
    (message: Message) => {
      if (ws && isConnected) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws, isConnected],
  );

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
  };
}
