import { useState, useEffect, useRef } from 'react';
import { Box, Textarea, ScrollArea, Text, Paper } from '@mantine/core';
import { Socket, io } from 'socket.io-client';
import config from '../../config';
import { useAuth } from '../../hooks/AuthProvider';

interface ChatMessage {
  userId: string;
  body: string;
}

interface ChatBoxTabProps {
  roomId: string;
  token: string;
}

const ChatBoxTab = ({ roomId, token }: ChatBoxTabProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/comm/socket.io',
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Join the specified room
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('joinRoom', roomId);
    });

    // Load past messages when joining the room
    socketRef.current.on('loadPreviousMessages', (pastMessages: ChatMessage[]) => {
      setMessages(pastMessages);
      scrollToBottom();
    });

    // Listen for new chat messages
    socketRef.current.on('chatMessage', (msg: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, token]);

  const sendMessage = () => {
    if (input.trim() !== '' && socketRef.current) {
      socketRef.current.emit('chatMessage', { body: input });
      setInput(''); // Clear the input after sending
    }
  };

  const scrollToBottom = () => {
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
      <ScrollArea style={{ flexGrow: 1, marginBottom: '10px', padding: '10px' }} viewportRef={scrollAreaRef}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.userId === userId ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
              position: 'relative'
            }}
          >
            <Paper
              shadow="sm"
              p="8px 12px"
              style={{
                maxWidth: '70%',
                borderRadius: '16px',
                backgroundColor: msg.userId === userId ? '#964ee2' : '#2c2533',
                color: msg.userId === userId ? '#fff8f9' : '#faf6f9',
                position: 'relative',
                padding: '12px',
              }}
            >
              <Text size="sm" style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                {msg.body}
              </Text>
            </Paper>
          </Box>
        ))}
      </ScrollArea>
      <Textarea
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        minRows={1}
        maxRows={5} // Limits the textarea expansion to 5 rows
        autosize // Allows for automatic resizing
      />
    </Box>
  );
};

export default ChatBoxTab;
