import { useState, useEffect, useCallback } from 'react';

type Message = Record<string, unknown>;

export function useWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => setIsConnected(true);
    websocket.onclose = () => setIsConnected(false);
    websocket.onmessage = (event) => setLastMessage(JSON.parse(event.data));

    return () => {
      websocket.close();
    };
  }, [url]);

  const sendMessage = useCallback(
    (message: Message) => {
      if (ws && isConnected) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws, isConnected],
  );

  return { isConnected, lastMessage, sendMessage };
}
