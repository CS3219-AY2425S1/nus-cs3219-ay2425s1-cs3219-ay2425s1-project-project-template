import React, { useState, useRef, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { UserContext } from "../../context/UserContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuesApiContext } from "../../context/ApiContext";
import { Question } from "../question/questionModel";
import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import EditorElement from "./EditorElement";

const EditorView: React.FC = () => {
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [socketId, setSocketId] = useState<string | undefined>("");
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("javascript");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty");
  const [question, setQuestion] = useState<Question | null>(null);
  const api = useQuesApiContext();

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (roomId === null || roomId === "") {
      // || topic === null ||
      // difficulty === null ||
      // topic === "" ||
      // difficulty === "" ||
      navigate("/dashboard");
      return;
    }

    socketRef.current = io("http://localhost:3004/", {
      path: "/api",
      query: { roomId },
    });
    const socket = socketRef.current;

    if (socket === null) return;

    socket.on("connect", () => {
      setSocketId(socket.id);
      socket.emit("joinQueue", { username: user?.username, topic, difficulty });
    });

    socket.on("matched", async (data: { message: string; room: string; questionId: string }) => {
      setRoom(data.room);
      setIsMatched(true);
      await fetchQuestion(data.questionId); // Fetch the question using the questionId
    });

    socket.on("queueEntered", (data: { message: string }) => {
      console.log("queue entered", data);
    });

    socket.on("matchFailed", (data: { error: string }) => {
      console.log("Match failed:", data.error);
    });

    socket.on("assignSocketId", (data: { socketId: string }) => {
      console.log("Socket ID assigned:", data.socketId); // Log when the socket ID is assigned
      setSocketId(data.socketId); // Set the socket ID from the server
      setMessages((prevMessages) => [
        ...prevMessages,
        `You are assigned to: ${data.socketId}`, // Add to messages
      ]);
    });

    socket.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Scroll to the bottom
      }
    });

    socket.on(
      "receiveMessage",
      (data: { username: string; message: string }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `${data.username}: ${data.message}`,
        ]);
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }
    );

    // Listen for language changes
    socket.on("languageChange", (newLanguage: string) => {
      setLanguage(newLanguage);
    });

    return () => {
      if (socketRef.current !== null) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchQuestion = async (questionId: string) => {
    try {
      const response = await api.get(`/questionsById?id=${questionId}`);
      setQuestion(response.data.questions[0]);
      console.log(response.data.questions[0])
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && socketRef && isMatched) {
      socketRef.current?.emit("sendMessage", {
        room,
        message,
        username: user?.username,
      });
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="collaboration-container">
      <div className="right-side" style={styles.rightSide}>
        <div className="editor-container" style={styles.editorContainer}>
          {socketRef.current && <EditorElement socket={socketRef.current} />}
        </div>
        <div className="chat-container" style={styles.chatContainer}>
          <div className="chat-box" ref={chatBoxRef} style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                {msg}
              </div>
            ))}
          </div>
          <div className="socket-id-display" style={styles.socketIdDisplay}>
            {socketId && <div>Your Socket ID: {socketId}</div>}
          </div>
          <div className="chat-input" style={styles.chatInput}>
            <button onClick={sendMessage} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  languageSelector: {
    margin: "10px 0",
    color: "black",
  },
  editorContainer: {
    margin: "10px",
  },
  questionDisplay: {
    flex: 1,
    padding: "20px",
    borderRight: "1px solid #ccc",
    backgroundColor: "#170c0c",
    overflowY: "auto" as const,
  },
  chatContainer: {
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
  },
  chatBox: {
    height: "200px",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    overflowY: "auto" as const,
    backgroundColor: "#fafafa",
  },
  message: {
    color: "black",
  },
  socketIdDisplay: {
    padding: "10px",
    backgroundColor: "#e9ecef",
    textAlign: "center" as const,
    color: "blue",
  },
  chatInput: {
    display: "flex",
    padding: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginRight: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    color: "black",
  },
  sendButton: {
    padding: "8px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EditorView;
