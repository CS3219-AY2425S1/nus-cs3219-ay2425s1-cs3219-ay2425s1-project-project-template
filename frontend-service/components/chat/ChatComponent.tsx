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
import ScrollableFeed from "react-scrollable-feed";

interface ChatComponentProps {
  userId: string;
  roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, roomId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { author: string; message: string; time: string }[]
  >([]);

  useEffect(() => {
    // Initialize the socket connection only after userId and roomId are set
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.emit("join_room", { roomId, userId });

    newSocket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, roomId]);

  const sendMessage = () => {
    if (!socket || !userId || !roomId) return;

    const messageData = {
      roomId,
      message,
      author: userId,
      time: new Date().toISOString(),
    };
    socket.emit("send_message", messageData);
    setMessage("");
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md" maxW="md">
      <VStack spacing={4} align="stretch">
        <Box
          bg="gray.50"
          p={4}
          borderRadius="md"
          overflowY="auto"
          height="650px"
          width="100%"
        >
          <ScrollableFeed>
            {messages.map((msg, index) => (
              <Flex
                key={index}
                mb={3}
                align="flex-end"
                justify={msg.author === userId ? "flex-end" : "flex-start"}
              >
                <Box
                  bg={msg.author === userId ? "#BEE3F8" : "#B9F5D0"}
                  color="black"
                  borderRadius="20px"
                  padding="0.5px 12px"
                  maxWidth="70%"
                  alignSelf={msg.author === userId ? "flex-end" : "flex-start"}
                  ml={msg.author === userId ? "auto" : undefined}
                  mr={msg.author === userId ? 2 : undefined}
                >
                  <Text lineHeight="1">{msg.message}</Text>
                </Box>
              </Flex>
            ))}
          </ScrollableFeed>
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
