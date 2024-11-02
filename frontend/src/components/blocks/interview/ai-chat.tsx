import { type LanguageName } from '@uiw/codemirror-extensions-langs';
import React, { useRef,useState } from 'react';

import { sendChatMessage } from '@/services/collab-service';

import { ChatLayout } from './chat/chat-layout';
import { ChatMessageType } from './chat/chat-message';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  editorCode?: string;
  language?: LanguageName;
  questionDetails?: string;
}

export const AIChat: React.FC<AIChatProps> = ({
  isOpen,
  onClose,
  editorCode = '',
  language = 'typescript',
  questionDetails = '',
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const streamingTextRef = useRef<string>('');

  const handleSend = async (userMessage: string): Promise<void> => {
    if (!userMessage.trim() || isLoading) return;

    // Reset streaming text reference
    streamingTextRef.current = '';

    // Add user message
    const newMessage: ChatMessageType = {
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        messages: [...messages, newMessage].map((v) => ({
          role: v.isUser ? 'user' : 'assistant',
          content: v.text,
        })),
        editorCode,
        language,
        questionDetails,
      };

      // Add AI response placeholder
      setMessages((prev) => [
        ...prev,
        {
          text: '',
          isUser: false,
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      const response = await sendChatMessage(payload, (chunk) => {
        // Update streaming text
        streamingTextRef.current = chunk;

        // Update the last message with the accumulated text
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            text: streamingTextRef.current,
            isUser: false,
            timestamp: new Date(),
            isStreaming: true,
          };
          return newMessages;
        });
      });

      if (response.success) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            text: newMessages[newMessages.length - 1].text,
            isUser: false,
            timestamp: new Date(),
            isStreaming: false,
          };
          return newMessages;
        });
      } else {
        setError('Failed to get response from AI');
        // Remove the streaming message if there was an error
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching the response'
      );
      // Remove the streaming message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      streamingTextRef.current = '';
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
