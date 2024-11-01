import { Bot, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { AIChat } from './ai-chat';
import { PartnerChat } from './partner-chat';

type FloatingChatButtonProps = {
  room: string;
  onChatOpenChange: (isOpen: boolean) => void;
};

export const FloatingChatButton = ({ room, onChatOpenChange }: FloatingChatButtonProps) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isPartnerChatOpen, setIsPartnerChatOpen] = useState<boolean>(false);

  const toggleAIChat = () => {
    const newStatus = !isAIChatOpen;
    setIsAIChatOpen(newStatus);
    onChatOpenChange(newStatus || isPartnerChatOpen);
  };

  const togglePartnerChat = () => {
    const newStatus = !isPartnerChatOpen;
    setIsPartnerChatOpen(newStatus);
    onChatOpenChange(newStatus || isAIChatOpen);
  };

  return (
    <div className='fixed bottom-3 right-3'>
      <div className='group relative'>
        <Button className='size-12 rounded-full bg-blue-500 shadow-lg transition-transform hover:scale-105 hover:bg-blue-600'>
          <MessageSquare className='size-6' />
        </Button>

        <div className='absolute bottom-full mb-2 space-y-2 opacity-0 transition-opacity group-hover:opacity-100'>
          <div className='relative flex items-center'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className='size-12 rounded-full bg-blue-500 hover:bg-blue-600'
                    onClick={toggleAIChat}
                  >
                    <Bot className='size-10' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left' align='center' className='bg-gray-700 text-white'>
                  AI Assistant
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='relative flex items-center'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className='size-12 rounded-full bg-blue-500 hover:bg-blue-600'
                    onClick={togglePartnerChat}
                  >
                    <User className='size-10' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left' align='center' className='bg-gray-700 text-white'>
                  Chat with Partner
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {isAIChatOpen && <AIChat isOpen={isAIChatOpen} onClose={() => toggleAIChat()} />}
      {isPartnerChatOpen && (
        <PartnerChat roomId={room} isOpen={isPartnerChatOpen} onClose={() => togglePartnerChat()} />
      )}
    </div>
  );
};
