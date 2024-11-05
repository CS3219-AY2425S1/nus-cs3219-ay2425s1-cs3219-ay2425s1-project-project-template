"use client"
import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface ChatProps {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
  userName: string;
}

const Chat: React.FC<ChatProps> = ({ ydoc, provider, userName }) => {
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<{ name: string; color: string }[]>([]);

  useEffect(() => {
    const ymessages = ydoc.getArray<{ user: string; message: string }>('chat-messages');

    // Observe changes in chat messages
    ymessages.observe(() => {
      setMessages(ymessages.toArray());
    });

    // Handle user awareness
    const { awareness } = provider;
    const handleAwarenessChange = () => {
      const states = Array.from(awareness.getStates().values());
      const connectedUsers = states.map((state: any) => state.user);
      setUsers(connectedUsers);
    };

    awareness.on('change', handleAwarenessChange);

    return () => {
      awareness.off('change', handleAwarenessChange);
    };
  }, [ydoc, provider]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const ymessages = ydoc.getArray<{ user: string; message: string }>('chat-messages');
      ymessages.push([{ user: userName, message: newMessage }]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    const chatMessagesDiv = document.querySelector('.chat-messages');
    if (chatMessagesDiv) {
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-4/5 flex-col w-full">
      <div className='text-2xl text-center font-bold'>Chat</div>
      <div className="flex-1 overflow-y-auto p-2.5 border">
        {messages.map((msg, index) => (
          <div key={index} className='mb-2.5'>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex p-2.5">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Type a message..."
          className='flex-1 p-1'
        />
        <button onClick={handleSendMessage} className="pl-1 pt-2.5">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;