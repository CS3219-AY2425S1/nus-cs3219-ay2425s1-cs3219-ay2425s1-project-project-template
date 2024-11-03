import React, { useState } from 'react';

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

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<ChatMessageType>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callOpenAI = async (userMessage: string): Promise<string> => {
    if (!API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const openAIMessages = messages.map((msg) => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text,
    }));

    openAIMessages.push({ role: 'user', content: userMessage });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful coding assistant. Provide concise, accurate answers.',
          },
          ...openAIMessages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleSend = async (userMessage: string): Promise<void> => {
    if (!userMessage.trim() || isLoading) return;

    setMessages((prev) => [...prev, { text: userMessage, isUser: true, timestamp: new Date() }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await callOpenAI(userMessage);
      setMessages((prev) => [...prev, { text: response, isUser: false, timestamp: new Date() }]);
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
