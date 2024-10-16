import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"; // WebSocket client for Socket.IO
import { Button } from "@/components/ui/button";
import { useStopwatch } from "react-timer-hook";

interface MatchingButtonProps {
  selectedTopic: string[];
  selectedDifficulty: string[];
}

const MatchingButton: React.FC<MatchingButtonProps> = ({
  selectedDifficulty,
  selectedTopic,
}) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const socketRef = useRef<any>(null);

  const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });

  useEffect(() => {
    if (isMatching) {
      const matchingServiceBackendUrl =
        import.meta.env.VITE_MATCHING_SERVICE_BACKEND_URL ||
        "ws://localhost:5003/matching";
      const token = sessionStorage.getItem("authToken");
      const uid = sessionStorage.getItem("uid");

      // Initialize WebSocket connection
      socketRef.current = io(matchingServiceBackendUrl, {
        auth: {
          token: token,
          uid: uid,
        },
        withCredentials: true,
      });

      // Listen for events from backend
      socketRef.current.on("matched", (data: any) => {
        reset(); // Reset stopwatch
        setMatchFound(true);
        console.log("Match found: ", data);
        socketRef.current.emit("joinRoom", data.sessionData.uid, data.roomId);
      });

      socketRef.current.on("matchmakingTimedOut", (timedOutMessage: any) => {
        reset(); // Reset stopwatch
        setIsMatching(false);
        alert(timedOutMessage);
      });

      socketRef.current.on(
        "doubleMatchingRequest",
        (doubleRequestMessage: any) => {
          reset(); // Reset stopwatch
          setIsMatching(false);
          alert(doubleRequestMessage);
        }
      );

      socketRef.current.on(
        "noQuestionsFound",
        (noQuestionsFoundMessage: any) => {
          reset(); // Reset stopwatch
          setIsMatching(false);
          alert(noQuestionsFoundMessage);
        }
      );

      socketRef.current.on("DisconnectSocket", () => {
        socketRef.current.disconnect();
      });

      socketRef.current.on("error", (errorMessage: any) => {
        reset(); // Reset stopwatch
        setIsMatching(false);
        alert(errorMessage);
      });

      // Start matchmaking
      socketRef.current.emit("startMatching", {
        uid: uid,
        difficulty: selectedDifficulty,
        topic: selectedTopic,
      });

      // Start the stopwatch
      start();
    }

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      reset(); // Reset stopwatch
    };
  }, [isMatching]);

  const handleStartMatchmaking = () => {
    if (!selectedTopic.length || !selectedDifficulty.length) {
      alert("Please select both a topic and difficulty");
      return;
    }
    reset(); // Reset stopwatch
    setIsMatching(true);
  };

  const handleCancelMatchmaking = () => {
    reset();
    setIsMatching(false);
    socketRef.current.emit("cancelMatching", sessionStorage.getItem("uid"));
  };

  return (
    <div>
      {isMatching && !matchFound ? (
        <div>
          <Button
            className="w-full"
            onClick={handleCancelMatchmaking}
            size="default"
          >
            Cancel Matching
          </Button>
          <div className="flex justify-center items-center h-16">
            <p>
              Time elapsed: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
          </div>
        </div>
      ) : matchFound ? (
        <p>Match Found! Collaboration Starting...</p>
      ) : (
        <Button
          className="w-full"
          onClick={handleStartMatchmaking}
          size="default"
        >
          Start Matching
        </Button>
      )}
    </div>
  );
};

export default MatchingButton;
