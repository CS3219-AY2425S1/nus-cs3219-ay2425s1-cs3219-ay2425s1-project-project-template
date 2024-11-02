import { Loader2, MessageSquare, Send, X } from 'lucide-react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus and scroll to bottom on window open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      scrollToBottom();
    }
  }, [isOpen]);

  // Scroll to bottom on reception of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Resize textarea on input, up to a maximum height
  useEffect(() => {
    const textAreaEl = inputRef.current;

    if (textAreaEl) {
      textAreaEl.style.height = 'auto';
      textAreaEl.style.height = `${Math.min(textAreaEl.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='flex size-full flex-col'>
      <div
        id='chat-header'
        className='bg-secondary/50 border-border flex items-center justify-between border-b py-1 pl-3 pr-1'
      >
        <div className='flex items-center gap-2'>
          <h2 className='font-semibold'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='hover:bg-secondary rounded-full'
          >
            <X className='size-5' />
          </Button>
        </div>
      </div>

      <ScrollArea id='chat-messages' className='h-full flex-1 overflow-y-auto p-4'>
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

      <div className='bg-secondary/50 border-border border-t p-3'>
        <div className='flex w-full items-center justify-between gap-3'>
          <Textarea
            rows={1}
            ref={inputRef}
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder='Type your message...'
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className='bg-primary-foreground scrollbar-thin scrollbar-track-black h-10 min-h-10 flex-1 resize-none overflow-y-auto p-2'
          />
          <Button
            variant='outline'
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className='min-h-10 px-3 py-2'
          >
            {isLoading ? <Loader2 className='size-4 animate-spin' /> : <Send className='size-4' />}
          </Button>
        </div>
      </div>
    </div>
  );
};
