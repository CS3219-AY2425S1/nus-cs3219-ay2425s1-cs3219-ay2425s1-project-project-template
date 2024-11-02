import React, { useState } from 'react';

import { sendChatMessage } from '@/services/collab-service';

import { ChatLayout } from './chat/chat-layout';
import { ChatMessageType } from './chat/chat-message';

// Types for OpenAI API
// interface OpenAIMessage {
//   role: 'user' | 'assistant';
//   content: string;
// }

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (userMessage: string): Promise<void> => {
    if (!userMessage.trim() || isLoading) return;

    setMessages((prev) => [...prev, { text: userMessage, isUser: true, timestamp: new Date() }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(
        messages.map((v) => ({ role: v.isUser ? 'user' : 'system', content: v.text }))
      );

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          { text: response.message, isUser: false, timestamp: new Date() },
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching the response'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatLayout
      isOpen={isOpen}
      onClose={onClose}
      messages={messages}
      onSend={handleSend}
      isLoading={isLoading}
      error={error}
      title='AI Assistant'
    />
  );
};
