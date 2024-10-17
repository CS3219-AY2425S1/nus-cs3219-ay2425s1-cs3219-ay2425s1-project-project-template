import React, { useState, useRef } from 'react';

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage('');
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Auto scroll to bottom
      }
    }
  };

  const joinRoom = () => {
    if (room.trim()) {
      alert(`Joined Room: ${room}`);
      setRoom('');
    }
  };

  return (
    <div className="chat-container" style={styles.chatContainer}>
      {/* Chat Box */}
      <div className="chat-box" ref={chatBoxRef} style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      {/* Message Input */}
      <div className="chat-input" style={styles.chatInput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>

      {/* Room Input */}
      <div className="room-input" style={styles.roomInput}>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
          style={styles.input}
        />
        <button onClick={joinRoom} style={styles.joinButton}>
          Join
        </button>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  chatContainer: {
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  chatBox: {
    height: '200px',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    overflowY: 'auto' as 'auto',
    backgroundColor: '#fafafa',
  },
  chatInput: {
    display: 'flex',
    padding: '10px',
  },
  roomInput: {
    display: 'flex',
    padding: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginRight: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
  },
  sendButton: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  joinButton: {
    padding: '8px 12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ChatUI;
