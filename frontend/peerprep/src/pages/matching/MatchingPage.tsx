import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Spinner, Box, Text } from "@chakra-ui/react";
import Timer from "./Timer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { UserContext } from "../../context/UserContext";

const MatchingPage: React.FC = () => {

  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [isMatched, setIsMatched] = useState<boolean>(false); 
  const [isTimeout, setIsTimeout] = useState<boolean>(false); 
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Track elapsed time

  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty");

  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const timerRef = useRef<number | null>(null);

  // Timeout handler
  const handleTimeout = (timeTaken: number) => {
    setElapsedTime(timeTaken); // Capture the elapsed time
    setIsLoading(false);
    setIsTimeout(true); // Trigger timeout logic when time runs out
  };

  // Success handler for match found
  const handleMatchFound = (room: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Stop the timer if a match is found
    }
    setIsLoading(false);
    setIsMatched(true); // Set match status
    setTimeout(() => {
      // Redirect to the collaboration room
      navigate(`/collaboration?topic=${topic}&difficulty=${difficulty}&room=${room}`);

    }, 1000);
  };

  useEffect(() => {
    if (topic === null || difficulty === null) {
      navigate("/dashboard");
      return;
    }

    // Initialize the WebSocket connection
    socketRef.current = io("http://localhost:3000/");
    const socket = socketRef.current;

    if (socket === null) {
      return;
    }

    // Start the loading and matching process
    setIsLoading(true);

    // Start a timer that increments every second
    // timerRef.current = window.setInterval(() => {
    //   setElapsedTime((prevTime) => prevTime + 1);
    // }, 1000);

    // Join the queue when connected
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinQueue", {
        username: user?.username,
        topic: topic,
        difficulty: difficulty,
      });
    });

    // Listen for a match success from the server
    socket.on("matched", (data: { room: string }) => {
      console.log("Matched and assigned to room:", data.room);
      handleMatchFound(data.room); // Handle match found with the room name
    });

    // Listen for a match failure from the server
    socket.on("matchFailed", (data: { error: string }) => {
      console.log("Match failed:", data.error);
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the timer on failure
        handleTimeout(elapsedTime); // Call handleTimeout with the elapsed time
      }
    });

    return () => {
      if (socketRef.current !== null) {
        socketRef.current.disconnect();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clean up the timer
      }
    };
  }, [topic, difficulty, user, navigate, elapsedTime]); // Add elapsedTime to dependencies

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100vh"
      bgGradient="linear(to-br, #1D004E, #141A67)"
      color="white"
      p={4}
    >
      <Text fontSize="2xl" fontWeight="bold">
        Selected Topic: {topic}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Selected Difficulty: {difficulty}
      </Text>

      <Timer
        timeLimit={60}
        onTimeout={handleTimeout}
        onMatchFound={() => {}}
        isMatched={isMatched}
      />

      {isLoading && (
        <Box textAlign="center" mt={4}>
          <Spinner size="xl" color="purple.600" />
          <Text fontSize="lg" mt={2}>Matching in progress...</Text>
          <Button mt={4} colorScheme="red" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
        </Box>
      )}

      {isMatched && (
        <Box textAlign="center" mt={4} bg="green.600" p={4} borderRadius="md" color="white">
          <Text fontSize="lg" fontWeight="bold">
            Successfully matched! Redirecting...
          </Text>
        </Box>
      )}

      {isTimeout && !isMatched && (
        <Box textAlign="center" mt={4} bg="red.600" p={4} borderRadius="md" color="white">
          <Text fontSize="lg" fontWeight="bold">
            Failed to find a match in {elapsedTime} seconds!
          </Text>
          <Button
            mt={4}
            colorScheme="purple"
            onClick={() => navigate("/matching")}
          >
            Try Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MatchingPage;