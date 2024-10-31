import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";

const ChatComponent = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { author: string; message: string; time: string }[]
  >([]);
  const roomId = "testRoom"; // Simulated room ID for testing

  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    newSocket.emit("join_room", roomId);

    newSocket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socket) return; // Early return if socket is not initialized

    const messageData = {
      roomId,
      author: "userId", // Replace with actual user ID
      message,
      time: new Date().toISOString(),
    };
    socket.emit("send_message", messageData);
    setMessage("");
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Box
          bg="gray.50"
          p={4}
          borderRadius="md"
          overflowY="auto"
          maxHeight="400px"
        >
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justify={msg.author === "userId" ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Box
                bg={msg.author === "userId" ? "blue.100" : "gray.200"}
                color={msg.author === "userId" ? "black" : "black"}
                p={3}
                borderRadius="md"
                maxWidth="70%"
              >
                <Text fontWeight={msg.author === "userId" ? "bold" : "normal"}>
                  {msg.author}:
                </Text>
                <Text>{msg.message}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(msg.time).toLocaleTimeString()}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>
        <HStack>
          <Input
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} colorScheme="blue">
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatComponent;
