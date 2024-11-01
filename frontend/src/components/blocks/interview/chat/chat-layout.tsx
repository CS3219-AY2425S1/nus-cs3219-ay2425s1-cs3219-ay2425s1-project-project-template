import { Loader2, MessageSquare, Send, X } from 'lucide-react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ChatMessage, ChatMessageType } from './chat-message';

interface ChatLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  onSend: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  title: string;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  isOpen,
  onClose,
  messages,
  onSend,
  isLoading,
  error,
  title,
}) => {
  const [input, setInput] = useState<string>('');
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

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='flex size-full flex-col'>
      <div className='bg-secondary/50 flex items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <h2 className='font-semibold'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
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

      <ScrollArea className='h-full flex-1 overflow-y-auto p-4'>
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

      <div className='bg-secondary/50 border p-4'>
        <div className='flex gap-2'>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder='Type your message...'
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className='bg-primary-foreground flex-1'
          />
          <Button variant='outline' onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className='size-4 animate-spin' /> : <Send className='size-4' />}
          </Button>
        </div>
      </div>
    </div>
  );
};
