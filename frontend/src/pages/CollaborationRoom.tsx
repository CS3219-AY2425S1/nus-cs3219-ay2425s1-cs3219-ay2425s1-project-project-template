import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";

const SOCKET_SERVER_URL = import.meta.env.VITE_COLLABORATION_API_URL;

const CollaborativeEditor: React.FC = () => {
  const { user, token } = useAuth(); // Destructure token directly
  const { roomId } = useParams<{ roomId: string }>();
  const socketRef = useRef<Socket | null>(null);
  const [code, setCode] = useState<string>(
    "function helloWorld() { console.log('Hello, world!'); }"
  );
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the question object from location.state
  const { question } = location.state;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Initialize the socket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    // Retrieve the required data
    const userId = user.id; // Ensure the user object contains the userId
    const userName = user.name;
    const questionId = question._id || question.id; // Adjust based on your question object

    // Emit the join_collab event with all required data
    socketRef.current.emit(
      "join_collab",
      { roomId, userName, userId, questionId, token },
      (response: { success: boolean }) => {
        if (response.success) {
          setIsConnected(true);
          console.log(`Joined collaboration room: ${roomId}`);
        } else {
          console.error("Failed to join collaboration room");
        }
      }
    );

    // Listen for code updates
    socketRef.current.on("code_update", ({ code }: { code: string }) => {
      setCode(code);
    });

    // Handle when a user leaves the collaboration room
    socketRef.current.on(
      "leave_collab_notify",
      ({ userName }: { userName: string }) => {
        console.log(`User ${userName} left the collaboration room.`);
        toast.info(
          `User ${userName} left the collaboration room. Redirecting to match selection in 5s...`
        );

        setTimeout(() => navigate(`/matching`), 3000);
      }
    );

    // Cleanup when the component unmounts
    return () => {
      cleanupCollaboration(code);
    };
  }, [roomId, user, navigate]);

  const handleEditorChange = (newCode: string | undefined) => {
    setCode(newCode || "");

    if (socketRef.current) {
      socketRef.current.emit("code_change", { roomId, code: newCode });
    }
  };

  const handleLeaveRoom = () => {
    cleanupCollaboration(code);
    navigate("/matching"); // Redirect to match selection after leaving the room
  };

  const cleanupCollaboration = (codeContent: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leave_collab", { roomId, codeContent });
      socketRef.current.disconnect();
    }
  };


  return (
    <>
      <Header />
      <Box sx={{ p: 4 }}>
        {/* Displaying the question */}
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
              height="80vh"
              defaultLanguage="javascript"
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={handleLeaveRoom}
            >
              Leave Collaboration
            </Button>
          </>
        ) : (
          <Typography variant="h6" color="error">
            Connecting to the collaboration room...
          </Typography>
        )}
      </Box>
    </>
  );
};

export default CollaborativeEditor;
