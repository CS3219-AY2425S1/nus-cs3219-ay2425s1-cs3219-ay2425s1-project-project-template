import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { Question } from "../question/questionModel";

const socketUrl = "http://localhost:8081"; // Chat service port

interface ChatBoxProps {
  roomId: string | null;
  user: { username: string } | null;
  onEndSession: (question : Question | null, currentCode : string) => Promise<void>;
  question: Question | null; 
  currentCode: string;
}
  
const ChatBox: React.FC<ChatBoxProps> = ({ roomId, user, onEndSession, question, currentCode }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socketId, setSocketId] = useState<string | undefined>("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null); // Ref to store the socket instance
  const questionRef = useRef<Question | null>(question);
  const currentCodeRef = useRef<string>(currentCode);

  useEffect(() => {
    questionRef.current = question;
    currentCodeRef.current = currentCode;
  }, [question, currentCode]);

  useEffect(() => {
    // Initialize the socket connection once
    socketRef.current = io(socketUrl);

    socketRef.current.on("connect", () => {
      setSocketId(socketRef.current?.id);

      if (roomId) {
        socketRef.current?.emit("joinRoom", roomId);
        console.log("Joined room:", roomId);
      }
    });

    // Listen for messages from the server
    socketRef.current.on("receiveMessage", (data: { username: string; message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${data.username}: ${data.message}`,
      ]);
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    });

  
    socketRef.current.on("leaveSession", () => {
      console.log("Session Ended");
      onEndSession(questionRef.current, currentCodeRef.current); 
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current?.disconnect();
    };
  }, [onEndSession]);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      // Emit the message to the chat service
      socketRef.current.emit("sendMessage", {
        room: roomId,
        message,
        username: user?.username,
      });
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
    }
  };

  
  const handleEndSession = () => {
    const confirmDisconnect = window.confirm("Are you sure you want to disconnect?");
    if (confirmDisconnect) {
      socketRef.current?.emit("endSession", roomId);
    }
  }

  return (
    <div>
      <button onClick={handleEndSession}>
          End Session
      </button>
      {/* Chat UI */}
      <div ref={chatBoxRef} style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;