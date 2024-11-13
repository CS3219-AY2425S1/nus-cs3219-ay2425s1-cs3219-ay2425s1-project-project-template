import React, { useState, useEffect, useRef } from "react";
import { askCopilot } from "../../api/CopilotApi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Editor, { useMonaco } from "@monaco-editor/react";
import ChatHeader from "../../components/chat/ChatHeader.js";
import Text from "../../components/chat/Text.js";
import TextInput from "../../components/chat/TextInput.js";
import { addSessionToUser, updateSessionHistory } from "../../api/UserApi.js"
import Modal from 'react-modal';
import Loader from "../../components/utils/Loader";
import debounce from "lodash/debounce";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "HTML", value: "html" },
];

const COLLABORATION_WS_URL =
  process.env.REACT_APP_COLLABORATION_WS_URL ||
  "ws://localhost:8003/ws-collaboration";

const CollaborationRoom = () => {
  const [status, setStatus] = useState("Connecting...");
  const { roomId } = useParams();
  const [message, setMessage] = useState(""); // Track the input message
  const [messages, setMessages] = useState([]); // Store all chat messages
  const location = useLocation();
  const { difficulty, category, userId, matchedUserId, question } = location.state || {};
  const [ws, setWs] = useState(null); // Manage the WebSocket connection here.
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef(null);
  const monaco = useMonaco();
  const navigate = useNavigate(); // For navigation

  const [userPrompt, setUserPrompt] = useState(""); // Track the user input for the prompt
  const [copilotResponse, setCopilotResponse] = useState(""); // Store the response from Copilot API
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // Helper function to save session data
  const saveSessionData = () => {
    console.log("Attempting to update session data:", {
      userId,
      roomId,
      language,
      code: code,
    });
    
    updateSessionHistory(userId, roomId, {
      codeLanguage: language,
      code: code,
    })
      .then((response) => {
        console.log("Session data updated successfully:", response);
      })
      .catch((error) => {
        console.error("Error updating session data:", error);
      });
  };

  // Debounce the session save to avoid excessive calls
  const debouncedSaveSessionData = debounce(() => saveSessionData(), 1000);

  // Create a WebSocket connection when the component mounts.
  useEffect(() => {
    const websocket = new WebSocket(COLLABORATION_WS_URL);

    websocket.onopen = () => {
      console.log("WebSocket connected.");
      setStatus("Connected to the server.");

      // Send a message to create the room
      websocket.send(
        JSON.stringify({
          type: "CREATE_ROOM",
          roomId: roomId,
          users: [userId, matchedUserId],
          difficulty: difficulty,
          category: category,
          question: question
        })
      );
    };

    websocket.onmessage = (message) => {
      console.log("Received message:", message.data);
      const result = JSON.parse(message.data);

      if (result.type === "MESSAGE") {
        // Add the message to the chat
        setMessages((prev) => [
          ...prev,
          { userId: result.userId, message: result.message },
        ]);
      } else if (result.type === "CREATE_SUCCESS") {
        // Room created successfully, now join the room
        websocket.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            roomId,
            userId,
          })
        );

        const sessionData = {
          roomId: roomId,
          matchedUserId: matchedUserId,
          questionId: question?._id,
          startDate: new Date(),
        };
        try {
          addSessionToUser(userId, sessionData);
          console.log("Successfully added sessionData to " + userId);
        } catch (error) {
          console.error("Failed to add sessionData to " + userId, error);
        }
      } else if (result.type === "CODE_UPDATE") {
        setCode(result.code);
      } else if (result.type === "USER_LEFT") {
        userLeaveRoom();
      } else if (result.type === "ROOM_EXIST") {
        websocket.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            roomId,
            userId,
          })
        );
      } else if (result.type === "LANGUAGE_CHANGE") {
        setLanguage(result.language);
      } else if (result.type === "ASK_COPILOT") {
        setCopilotResponse(result.response);
      }
    };

    websocket.onerror = (error) => {
      setStatus("WebSocket connection error.");
      console.error("WebSocket error:", error);
    };

    websocket.onclose = (event) => {
      setStatus(
        `WebSocket closed: Code = ${event.code}, Reason = ${event.reason}`
      );
      console.log(
        `WebSocket closed: Code = ${event.code}, Reason = ${event.reason}`
      );
    };

    setWs(websocket); // Store the WebSocket connection.

    // Cleanup WebSocket when the component unmounts
    return () => {
      websocket.close();
    };
  }, [roomId, matchedUserId, difficulty, category, userId]);

  // Warn user before navigating away or refreshing the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Modern browsers require this to show the confirmation dialog.
    };

    // Add the event listener for refreshing or closing the tab
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Clean up the event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Function to handle the "Leave Room" button click
  const handleLeaveRoom = () => {
    const confirmation = window.confirm(
      "Are you sure you want to leave the room?"
    );
    if (confirmation) {
      navigate("/"); // Navigate the user out of the room
    }
  };

  const handleModalClose = () => {
    // Close the modal and navigate to the home page
    setShowModal(false);
    navigate("/"); // Redirect to the home page
  };

  const userLeaveRoom = () => {
    setShowModal(true);
  };  

  const onCodeChange = (newCode) => {
    setCode(newCode);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "CODE_CHANGE",
          roomId: roomId,
          code: newCode,
          userId: userId,
        })
      );
    }
  };

  // To detect code change
  useEffect(() => {
    console.log("Code updated:", code);
    debouncedSaveSessionData(); // Save session periodically as code changes
  }, [code]);

  const onLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "LANGUAGE_CHANGE",
          roomId: roomId,
          language: newLanguage,
          userId: userId,
        })
      );
    }
  };
  

  const sendMessage = (event) => {
    event.preventDefault();
    if (ws && message) {
      ws.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          roomId,
          userId,
          message,
        })
      );
      setMessage(""); // Clear the message input
    }
  };

  const handleSubmitPrompt = async () => {
    setCopilotResponse(""); // Clear previous response

    const promptData = {
      code: code,
      prompt: userPrompt,
      type: "ASK_COPILOT",
      roomId: roomId,
    };

    try {
      console.log("Starting API call...");
      setCopilotResponse("Loading Response") // used to indicate loading
      const response = await askCopilot(promptData);
      console.log("response returned...");
      // setCopilotResponse(response); // Set the response from the API
    } catch (error) {
      console.error("Error calling Copilot API:", error);
      setCopilotResponse("Error: " + error.message);
    } finally {
      console.log("Setting isLoading to false");
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* Left Section: Question + Chat */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          backgroundColor: "#f7f7f7",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h1>Question: {question?.title || "Loading question..."}</h1>
          <p>
            {question?.description || "Please wait, the question is being loaded."}
          </p>
        </div>

        {/* Add the Leave Room Button here */}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          
          {/* Save Note */}
          <p className="text-lg text-red-600 font-bold bg-red-100 p-3 rounded-lg border border-red-600 mb-4">
            ⚠️ <span className="font-semibold">Important:</span> To save your code, remember to press 'Enter' in Text Editor before you leave!
          </p>

          <button
            onClick={handleLeaveRoom}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff4d4f",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Leave Room
          </button>
          <Modal
            isOpen={showModal}
            onRequestClose={handleModalClose} 
            contentLabel="User Left Room"
            style={{
              content: {
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                alignContent: "center",
                width: "300px", 
                margin: "auto",
                textAlign: "center", 
                
                height: "25vh"
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                display: "flex", // To center modal vertically
                justifyContent: "center", // Center horizontally
                alignItems: "center", 
              },
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>The other user has left the room</h2>
            <p style={{ marginBottom: "20px" }}>You are being redirected to the home page.</p>
            <button
              onClick={handleModalClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                border: "none",
                marginTop: "10px", // Add some space between the text and button
              }}
            >
              OK
            </button>
          </Modal>
        </div>

        {/* Chatbox Section */}
        <div className="chatMainContainer flex-1">
          <div className="chatContainer flex justify-center items-center h-screen bg-[#1A1A1D] sm:h-full ">
            <div className="container flex-1 flex-col justify-between bg-white h-[60%] w-[35%] sm:w-full sm:h-full md:w-[60%] p-0 relative">
              <ChatHeader roomName={roomId} />
              <Text messages={messages} name={userId} />
              <TextInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 2, height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Top Half: Editor Section */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px", backgroundColor: "#333", color: "white" }}>
            <label>Select Language: </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              style={{
                padding: "5px",
                borderRadius: "5px",
                marginLeft: "10px",
                color: "#333",
              }}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <Editor
            height="100%" // Fill available space in this section
            defaultLanguage="javascript"
            language={language}
            value={code}
            onChange={onCodeChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              backgroundColor: "#333",
            }}
          >
            <button
              onClick={formatCode}
              style={{
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Format Code
            </button>
          </div>
        </div>

        {/* Bottom Half: Copilot Input and Response Section */}
        <div style={{ flex: 1, padding: "10px", backgroundColor: "#333", color: "white", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask Copilot..."
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "70%",
                backgroundColor: "#222",
                color: "white",
              }}
            />

            <button
              onClick={handleSubmitPrompt}
              style={{
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                width: "25%",
              }}
            >
              Ask Copilot
            </button>
          </div>

          {/* Display Copilot Response */}
          <div style={{ flex: 1, backgroundColor: "#444", padding: "10px", borderRadius: "5px", overflowY: "auto" }}>
            <strong>Copilot Response:</strong>
            {copilotResponse !== "Loading Response"? (
              <p>{copilotResponse || "No response yet."}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Loader /> {/* Display loader component */}
                <p className="mt-3">Hold on, Co-pilot is preparing a response...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationRoom;
