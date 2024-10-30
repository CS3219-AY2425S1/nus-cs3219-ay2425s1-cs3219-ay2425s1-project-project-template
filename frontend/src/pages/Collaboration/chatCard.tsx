import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import io, { Socket } from "socket.io-client";

interface ChatCardProps {
  roomId: string;
  username: string;
}

const ChatCard: React.FC<ChatCardProps> = ({ roomId, username }) => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null); // Create a ref for the chat box

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [messages]);

  //   useEffect(() => {
  //     const newSocket = io("http://localhost:5000");
  //     setSocket(newSocket);

  //     newSocket.emit("joinRoom", roomId);

  //     newSocket.on("chatMessage", (message) => {
  //       setMessages((prevMessages) => [...prevMessages, message]);
  //     });

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }, [roomId]);

  const handleSendMessage = () => {
    // if (input.trim() && socket) {

    if (input.trim()) {
      //   socket.emit("chatMessage", { roomId, message: input, username });
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "You", text: input },
      ]);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      // If Ctrl + Enter is pressed, add a newline
      setInput((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      // If only Enter is pressed, send the message
      e.preventDefault(); // Prevent the default newline behavior
      handleSendMessage();
    }
  };

  return (
    <Card
      className="border-gray-700 text-white flex flex-col h-full"
      sx={{ maxHeight: "350px" }}
    >
      <CardContent className="p-6 bg-gray-800 flex-grow">
        <Typography
          variant="h6"
          className="mb-4"
          sx={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Chat
        </Typography>
        <Box
          ref={chatBoxRef}
          sx={{
            height: 200,
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: 2,
            mb: 2,
            flexGrow: 1,
          }}
          className="chat-box"
        >
          {messages.map((msg, index) => (
            <Typography
              key={index}
              variant="body1" // Increase the font size here
              className="text-gray-300"
              sx={{
                textAlign: "left", // Align messages to the left
                fontSize: "1.1rem", // Increase font size for visibility
                mb: 1,
              }}
            >
              <strong>{msg.user}</strong>:{" "}
              {/* Replace newlines with <br /> for rendering */}
              {msg.text.split("\n").map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < msg.text.split("\n").length - 1 && <br />}{" "}
                  {/* Add <br /> for each line except the last one */}
                </React.Fragment>
              ))}
            </Typography>
          ))}
        </Box>
        {/* Input and Send Button */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline // Enable multiline input using cttrl c
            minRows={1} // Minimum rows to show
            maxRows={2}
            sx={{
              flexGrow: 1,
              backgroundColor: "#ffffff", // White background for input box
              borderRadius: "4px",
            }}
            InputProps={{
              style: { color: "#000" }, // Black text color inside input
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{ flexShrink: 0 }}
          >
            Send
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
