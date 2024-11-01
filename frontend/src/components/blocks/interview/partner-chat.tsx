import { MessageSquare, Send, X } from 'lucide-react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/lib/hooks/use-chat';
import { getUserId } from '@/services/user-service';
import { Message as ChatMessageType } from '@/types/chat-types';

interface PartnerChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

const ChatMessage: React.FC<{ message: ChatMessageType; isUser: boolean }> = ({
  message,
  isUser,
}) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`max-w-[85%] rounded-lg px-4 py-2 text-xs ${
        isUser ? 'bg-blue-500 text-white' : 'border border-gray-100 bg-gray-50'
      }`}
    >
      <p className='whitespace-pre-wrap'>{message.message}</p>
      <div className='mt-1 text-xs opacity-60'>
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  </div>
);

export const PartnerChatSidebar: React.FC<PartnerChatSidebarProps> = ({
  isOpen,
  onClose,
  roomId,
}) => {
  const [input, setInput] = useState<string>('');
  const { messages, sendMessage, connected, error } = useChat({ roomId });
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
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
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
    <div
      className={`fixed right-0 top-14 h-[calc(100%-3.5rem)] bg-white shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-96`}
    >
      <div className='flex h-full flex-col'>
        <div className='flex items-center justify-between border-b bg-white px-4 py-3'>
          <div className='flex items-center gap-2'>
            <MessageSquare className='size-5 text-blue-500' />
            <h2 className='text-base font-semibold'>Chat Room</h2>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='rounded-full hover:bg-gray-100'
          >
            <X className='size-5' />
          </Button>
        </div>

        <ScrollArea className='flex-1 overflow-y-auto p-4'>
          {messages.length === 0 && connected && (
            <div className='flex h-full flex-col items-center justify-center text-gray-500'>
              <MessageSquare className='mb-4 size-12 opacity-50' />
              <p className='text-center'>No messages yet. Start a conversation!</p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.createdAt} message={msg} isUser={msg.senderId === getUserId()} />
          ))}
          {!connected && (
            <div className='text-center text-red-500'>
              <p>Connecting...</p>
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
              disabled={!connected}
              className='flex-1'
            />
            <Button
              onClick={handleSend}
              disabled={!connected || !input.trim()}
              className='bg-blue-500 hover:bg-blue-600'
            >
              <Send className='size-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
