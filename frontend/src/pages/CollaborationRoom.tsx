import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";

const SOCKET_SERVER_URL = import.meta.env.VITE_COLLABORATION_API_URL;

const CollaborativeEditor: React.FC = () => {
  const { user } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const socketRef = useRef<Socket | null>(null);
  const [code, setCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { question } = location.state;

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

    socketRef.current.on("leave_collab_notify", ({ userName }: { userName: string }) => {
      console.log(`User ${userName} left the collaboration room.`);
      toast.info(`User ${userName} left the collaboration room. Redirecting to match selection in 5s...`);
      setTimeout(() => navigate(`/matching`), 3000);
    });

    socketRef.current.on("code_result", ({ output }: { output: string }) => {
      setIsLoading(false);
      setOutput(output !== "" ? output : "None");
      socketRef.current?.emit("code_execution_finished", { roomId });
    });

    socketRef.current.on("code_execution_started", () => {
      setIsLoading(true);
    });

    socketRef.current.on("code_execution_finished", () => {
      setIsLoading(false);
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

  const handleRunCode = async () => {
    if (socketRef.current) {
      setIsLoading(true); 
      socketRef.current.emit("code_execution_started", { roomId });
      socketRef.current.emit("run_code", { roomId, code });
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4">{question.title}</Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }} 
            onClick={handleLeaveRoom}
          >
            Leave Collaboration
          </Button>
        </Box>
        <Typography variant="h6" color="textSecondary">
          Difficulty: {question.complexity}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
          {question.description}
        </Typography>

        <Typography variant="h6">Room ID: {roomId}</Typography>
        <Typography variant="h6">User: {user?.name}</Typography>

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
              onClick={handleRunCode}
              disabled={isLoading}
            >
              Run Code
            </Button>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center",mt: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Code is running...</Typography>
              </Box>
            ) : (
              output !== null && (
                <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 4, backgroundColor: "#f5f5f5" }}>
                  <Typography variant="h6">Output:</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {output}
                  </Typography>
                </Box>
              )
            )}
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
