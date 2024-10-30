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
    <div className="chat-container" style={{ height: '80%', display: 'flex', flexDirection: 'column' }}>
      <div className='text-2xl text-center font-bold'>Chat</div>
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '10px', border: '1px solid #ccc' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input" style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '5px' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '5px 10px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;