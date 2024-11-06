import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useCookies } from "react-cookie";



function Chat({ roomId }) {
    const [cookies] = useCookies(["username", "accessToken", "userId"]);
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');

    const socketRef = useRef(null);


    useEffect(() => {
        const userId = cookies.userId;

        socketRef.current = io('http://localhost:3003', { query: { userId } });
        console.log('Connecting to the chat service server socket');

        socketRef.current.emit('joinRoom', { roomId });

        const joinedState = localStorage.getItem(`chat-joined-${roomId}`) === 'true';

        if (joinedState) {
            console.log('Emitting joinRoom for chat service');
            socketRef.current.emit('joinRoom', { roomId });
            localStorage.setItem(`chat-joined-${roomId}`, 'true');
            console.log('Emitting first_username');
            socketRef.current.emit('first_username', { roomId, username: cookies.username });
        }

        socketRef.current.on('chatService_ready', (data) => {
            // setIsLoading(false);
            console.log('chatService_ready event received');
            console.log('Emitting joinRoom');
            socketRef.current.emit('joinRoom', { roomId });
            localStorage.setItem(`chat-joined-${roomId}`, 'true');
            console.log('Emitting first_username');
            socketRef.current.emit('first_username', { roomId, username: cookies.username });
    });


    // Listen for incoming chat messages
    socketRef.current.on('chat message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data.msg]);
        console.log('Received chat message:', data.msg  );
    });

    

    // Clean up the socket listener on component unmount
    return () => {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
    };
    }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg) {
      socketRef.current.emit('chat message', { roomId, msg });
      setInput(''); // Clear the input field after sending
      console.log('Sent chat message:', msg);
    }
  };

  return (
    <div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          id="input"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
