import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const Collaboration: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [socketId, setSocketId] = useState<string | undefined>(undefined); // Accepts undefined
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Replace with your backend URL
    setSocket(newSocket);

    newSocket.on("assignSocketId", (data: { socketId: string }) => {
      setSocketId(data.socketId); // Set the socket ID when assigned
    });

    newSocket.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    });

    newSocket.on('roomJoined', (data: { roomCode: string, socketId: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `You joined Room: ${data.roomCode} with Socket ID: ${data.socketId}`
      ]);
    });

    newSocket.on('userJoined', (data: { message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    // Cleanup function to disconnect the socket on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []); // Run once after initial render

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("message", { room, text: message });
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage('');
    }
  };

  const joinRoom = () => {
    if (room.trim() && socket) {
      socket.emit("joinRoom", { roomCode: room });
      setRoom('');
    }
  };

  const joinQueue = () => {
    if (socket && room) { // Assuming room is the topic or any identifier you want to use
      socket.emit("joinQueue", {
        username: "qqq", // Replace with actual user data if available
        topic: room,
        difficulty: "easy", // Add difficulty or other data as necessary
        questionId: "12345" // Replace with actual question ID if available
      });
      const displaySocketId = socketId ? socketId : "No socket ID assigned"; // Conditional check
      setMessages((prevMessages) => [
        ...prevMessages,
        `You have joined the queue with Socket ID: ${displaySocketId}`
      ]);
    }
  };
  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container" style={styles.chatContainer}>
      <div className="chat-box" ref={chatBoxRef} style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>{msg}</div>
        ))}
      </div>

      <div className="chat-input" style={styles.chatInput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message"
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>

      <div className="room-input" style={styles.roomInput}>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
          style={styles.input}
        />
        <button onClick={joinRoom} style={styles.joinButton}>
          Join Room
        </button>
      </div>

      <div className="queue-input" style={styles.queueInput}>
        <button onClick={joinQueue} style={styles.queueButton}>
          Join Queue
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
  message: {
    color: 'black',
  },
  chatInput: {
    display: 'flex',
    padding: '10px',
  },
  roomInput: {
    display: 'flex',
    padding: '10px',
  },
  queueInput: {
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
    color: 'black',
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
  queueButton: {
    padding: '8px 12px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Collaboration;
