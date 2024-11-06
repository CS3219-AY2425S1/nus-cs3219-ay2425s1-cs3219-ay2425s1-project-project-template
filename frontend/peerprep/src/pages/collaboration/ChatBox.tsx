import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Question } from "../question/questionModel";
import exitIcon from "../../assets/ExitIcon.png";

const socketUrl = "http://localhost:8081";

interface ChatBoxProps {
  roomId: string | null;
  user: { username: string } | null;
  onEndSession: (
    question: Question | null,
    currentCode: string
  ) => Promise<void>;
  question: Question | null;
  currentCode: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  roomId,
  user,
  onEndSession,
  question,
  currentCode,
}) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Start collapsed
  const [isEndSessionExpanded, setIsEndSessionExpanded] =
    useState<boolean>(false);
  const [otherUserName, setOtherUserName] = useState<string>(""); // New state for the other user's name
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const questionRef = useRef<Question | null>(question);
  const currentCodeRef = useRef<string>(currentCode);

  useEffect(() => {
    questionRef.current = question;
    currentCodeRef.current = currentCode;
  }, [question, currentCode]);

  useEffect(() => {
    socketRef.current = io(socketUrl);
    socketRef.current.on("connect", () => {
      if (roomId && user?.username) {
        socketRef.current?.emit("joinRoom", { roomId, username: user.username });
        console.log("Joined room:", roomId);
      }
    });

    // Listen for the `userJoined` event to update the other user's name
    socketRef.current.on("userJoined", (data: { username: string }) => {
      if (data.username !== user?.username) { // Ensure it's not the current user's name
        setOtherUserName(data.username);
      }
    });

    socketRef.current.on("leaveSession", () => {
      console.log("Session Ended");
      onEndSession(questionRef.current, currentCodeRef.current); 
    });

    socketRef.current.on(
      "receiveMessage",
      (data: { username: string; message: string }) => {
        if (data.username !== user?.username) {
          setMessages((prevMessages) => [
            ...prevMessages,
            `${data.username}: ${data.message}`,
          ]);
          setOtherUserName(data.username);
        }
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, user?.username, onEndSession]);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        room: roomId,
        message,
        username: user?.username,
      });
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
    }
  };

  const handleEndSessionClick = () => {
    if (isEndSessionExpanded) {
      const confirmExit = window.confirm(
        "Are you sure you want to end the session?"
      );
      if (confirmExit) {
        socketRef.current?.emit("endSession", roomId);
      }
    } else {
      setIsEndSessionExpanded(true);
    }
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const renderMessages = () => {
    if (isCollapsed && messages.length > 1) {
      const latestUserMessage = messages
        .reverse()
        .find((msg) => msg.startsWith("You:"));
      const latestOtherMessage = messages
        .reverse()
        .find((msg) => !msg.startsWith("You:"));
      return (
        <>
          {latestOtherMessage && (
            <div style={styles.receivedMessage}>{latestOtherMessage}</div>
          )}
          {latestUserMessage && (
            <div style={styles.userMessage}>{latestUserMessage}</div>
          )}
        </>
      );
    }
    return messages.map((msg, index) => (
      <div
        key={index}
        style={
          msg.startsWith("You:") ? styles.userMessage : styles.receivedMessage
        }
      >
        {msg}
      </div>
    ));
  };

  return (
    <div style={styles.chatBoxContainer}>
      <div style={styles.buttonContainer}>
        <button style={styles.collapseButton} onClick={toggleCollapse}>
          {isCollapsed ? "Click to chat" : "Collapse Chat"}
        </button>
        <button
          style={
            isEndSessionExpanded
              ? styles.expandedEndButton
              : styles.shortEndButton
          }
          onClick={handleEndSessionClick}
          onMouseLeave={() => setIsEndSessionExpanded(false)} // Shrinks the button back when mouse leaves
        >
          {isEndSessionExpanded ? (
            "End Session"
          ) : (
            <img src={exitIcon} alt="Exit" style={styles.icon} />
          )}
        </button>
      </div>
      <div ref={chatBoxRef} style={styles.messagesContainer}>
        {renderMessages()}
      </div>
      {!isCollapsed && (
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  chatBoxContainer: {
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: "#2e2e3e",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    height: "100%",
    color: "#ffffff",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    marginBottom: "10px",
  },
  collapseButton: {
    flex: 2,
    padding: "5px 10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    cursor: "pointer",
    marginRight: "5px",
  },
  shortEndButton: {
    width: "30px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FF5555",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
  },
  expandedEndButton: {
    flex: 1,
    padding: "5px 10px", // Expanded padding for full button
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FF5555",
    color: "#ffffff",
    cursor: "pointer",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#1e1e2e",
    borderRadius: "8px",
    maxHeight: "300px",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4e8ef7",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "10px",
    marginBottom: "5px",
    maxWidth: "75%",
    fontSize: "0.9rem",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#44475a",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "10px",
    marginBottom: "5px",
    maxWidth: "75%",
    fontSize: "0.9rem",
  },
  inputContainer: {
    display: "flex",
    marginTop: "5px",
  },
  input: {
    flex: 1,
    padding: "6px",
    fontSize: "0.85rem",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#1e1e2e",
    color: "#ffffff",
    marginRight: "5px",
  },
  sendButton: {
    padding: "6px 12px",
    fontSize: "0.85rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    cursor: "pointer",
  },
};

export default ChatBox;
