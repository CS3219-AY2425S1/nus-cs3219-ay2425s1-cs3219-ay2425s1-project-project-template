import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
import { Box, Typography, TextField, Button, List, ListItem, Paper } from "@mui/material";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";


const SOCKET_SERVER_URL = import.meta.env.VITE_COLLABORATION_API_URL;

const CollaborativeEditor: React.FC = () => {
  const { user } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const socketRef = useRef<Socket | null>(null);
  const [code, setCode] = useState<string>("function helloWorld() { console.log('Hello, world!'); }");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ userName: string; message: string; timestamp: number }[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { question } = location.state;

  // const question = {
  //   title: "Two Sum Problem",
  //   description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  //   difficulty: "Easy",
  // };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.emit("join_collab", { roomId, userName: user.name }, (response: { success: boolean }) => {
      if (response.success) {
        setIsConnected(true);
        console.log(`Joined collaboration room: ${roomId}`);
      }
    });

    socketRef.current.on("code_update", ({ code }: { code: string }) => {
      setCode(code);
    });

    socketRef.current.on("receive_message", (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current.on("leave_collab_notify", ({ userName }: { userName: string }) => {
      console.log(`User ${userName} left the collaboration room.`);
      toast.info(`User ${userName} left the collaboration room. Redirecting to match selection in 5s...`);

      setTimeout(async() => navigate(`/matching`), 3000);
    });


    return () => {
      cleanupCollaboration();
        };
  }, [roomId, user, navigate]);

  const handleEditorChange = (newCode: string | undefined) => {
    setCode(newCode || "");

    if (socketRef.current) {
      socketRef.current.emit("code_change", { roomId, code: newCode });
    }
  };

  const handleSendMessage = () => {
    if (socketRef.current && message.trim()) {
      const timestamp = Date.now();
      const chatMessage = { roomId, userName: user!!.name, message, timestamp: timestamp };
      setMessages((prevMessages) => [...prevMessages, chatMessage]); 
      socketRef.current.emit("send_message", chatMessage);
      setMessage("");
    }
  };

  const handleLeaveRoom = () => {
    cleanupCollaboration();
    navigate("/matching"); // Redirect to match selection after leaving the room
  };

  const cleanupCollaboration = () => {
    if (socketRef.current && user) {
      socketRef.current.emit("leave_collab", { roomId, userName: user.name });
      socketRef.current.disconnect();
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", height: "100vh", p: 2 }}>
        <Box sx={{ flex: 2, pr: 4 }}>
          {/* Displaying the hardcoded question */}
          <Typography variant="h4">{question.title}</Typography>
          <Typography variant="h6" color="textSecondary">
            Difficulty: {question.complexity}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
            {question.description}
          </Typography>

          {/* Collaboration Info */}
          <Typography variant="h6">Room ID: {roomId}</Typography>
          <Typography variant="h6">User: {user?.name}</Typography>

          {/* Code Editor */}
          {isConnected ? (
            <>
              <Editor
                height="65vh"
                defaultLanguage="javascript"
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
              />
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleLeaveRoom}>
                Leave Collaboration
              </Button>
            </>
          ) : (
            <Typography variant="h6" color="error">
              Connecting to the collaboration room...
            </Typography>
          )}
        </Box>

        {/* Chat Section */}
        <Box sx={{ flex: 1, p: 2, borderLeft: "1px solid #ccc" }}>
          <Typography variant="h5" gutterBottom>Chat</Typography>
          <Paper sx={{ height: "60vh", overflow: "auto", p: 2, mb: 2 }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: msg.userName === user?.name ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.userName === user?.name ? "primary.main" : "grey.300",
                      color: msg.userName === user?.name ? "white" : "black",
                    }}
                  >
                    <Typography variant="body2">
                      {msg.userName === user?.name ? `You` : msg.userName} -{" "}
                      <Typography component="span" variant="caption" sx={{ fontSize: "0.75em" }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                    </Typography>
                    <Typography variant="body1">{msg.message}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ mt: 1 }}>
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CollaborativeEditor;