import { Loader2, Maximize2, MessageSquare, Minimize2, Send, X } from 'lucide-react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types for OpenAI API
// interface OpenAIMessage {
//   role: 'user' | 'assistant';
//   content: string;
// }

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isCode?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeBlock: React.FC<{ content: string }> = ({ content }) => (
  <div className='group relative'>
    <pre className='my-4 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100'>
      <code>{content}</code>
    </pre>
    <button
      onClick={() => navigator.clipboard.writeText(content)}
      className='absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity group-hover:opacity-100'
    >
      Copy
    </button>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Detect if the message contains code (basic detection - can be enhanced)
  const hasCode = message.text.includes('```');
  const parts = hasCode ? message.text.split('```') : [message.text];

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 text-xs ${
          message.isUser ? 'bg-blue-500 text-white' : 'border border-gray-100 bg-gray-50'
        }`}
      >
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // Code block
            return <CodeBlock key={index} content={part.trim()} />;
          }

          return (
            <div key={index}>
              {part.split('\n').map((line, i) => (
                <p key={i} className='whitespace-pre-wrap'>
                  {line}
                </p>
              ))}
            </div>
          );
        })}
        <div className='mt-1 text-xs opacity-60'>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const callOpenAI = async (userMessage: string): Promise<string> => {
    if (!API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // convert the messages array to the format expected by the API
    const openAIMessages = messages.map((msg) => {
      return {
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      };
    });

    openAIMessages.push({
      role: 'user',
      content: userMessage,
    });

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

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setIsLoading(true);

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await callOpenAI(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          text: response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching the response'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed right-0 top-14 h-[calc(100%-3.5rem)] bg-white shadow-xl transition-all duration-300 ease-in-out${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isExpanded ? 'w-3/4' : 'w-96'}`}
    >
      <div className='flex h-full flex-col'>
        <div className='flex items-center justify-between border-b bg-white px-4 py-3'>
          <div className='flex items-center gap-2'>
            <MessageSquare className='size-5 text-blue-500' />
            <h2 className='text-base font-semibold'>AI Assistant</h2>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsExpanded(!isExpanded)}
              className='rounded-full hover:bg-gray-100'
            >
              {isExpanded ? <Minimize2 className='size-5' /> : <Maximize2 className='size-5' />}
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='rounded-full hover:bg-gray-100'
            >
              <X className='size-5' />
            </Button>
          </div>
        </div>

        <ScrollArea className='flex-1 overflow-y-auto p-4' ref={scrollAreaRef}>
          {messages.length === 0 && (
            <div className='flex h-full flex-col items-center justify-center text-gray-500'>
              <MessageSquare className='mb-4 size-12 opacity-50' />
              <p className='text-center'>No messages yet. Start a conversation!</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && (
            <div className='mb-4 flex justify-start'>
              <div className='rounded-lg bg-gray-50 px-4 py-2'>
                <Loader2 className='size-5 animate-spin text-gray-500' />
              </div>
            </div>
          )}
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className='border-t bg-white p-4'>
          <div className='flex gap-2'>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder='Type your message...'
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className='flex-1'
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {isLoading ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Send className='size-4' />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingChatButton: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        className='fixed bottom-6 right-6 size-12 rounded-full bg-blue-500 shadow-lg transition-transform hover:scale-105 hover:bg-blue-600'
        onClick={() => setIsSidebarOpen(true)}
      >
        <MessageSquare className='size-6' />
      </Button>

      <ChatSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default FloatingChatButton;
