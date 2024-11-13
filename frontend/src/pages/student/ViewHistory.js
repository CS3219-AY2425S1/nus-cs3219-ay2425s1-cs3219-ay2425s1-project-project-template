import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";

const ViewHistory = () => {
  const { roomId } = useParams();
  const location = useLocation();

  // Access question from location.state
  const sessionData = location.state?.sessionData;

  // Placeholder for saved code (Replace this with the code retrieved from backend or context)
  const [code, setCode] = useState(`// This is some example code\nfunction add(a, b) {\n  return a + b;\n}`);
  
  // Optionally, you could retrieve code from backend using useEffect when component mounts
  useEffect(() => {
    // Fetch code and chat history based on roomId
    // setCode(fetchedCode); // Set fetched code
  }, [roomId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Session History for Room {roomId}</h1>
      
      {/* Question Topic and Description */}
      {sessionData && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Question: {sessionData?.question?.title || "No Title"}</h2>
          <p className="text-md text-gray-700">{sessionData?.question?.description || "No description available."}</p>
        </div>
      )}

      {/* Code Section with Monaco Editor */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Code History</h2>
        {/* show me question and description */}
        <Editor
          height="300px"  // Set a height for the editor
          defaultLanguage={sessionData?.language || "javascript"}  // Set the language for syntax highlighting
          theme="vs-dark"  // Optional: set a theme
          value={code}  // Display the saved code
          options={{ readOnly: true, minimap: { enabled: false } }}  // Make it read-only and disable the minimap if desired
        />
      </div>

      {/* Chat History Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chat History</h2>
        <div className="max-h-64 overflow-y-auto p-3 bg-white rounded-md">
          {/* Sample chat messages */}
          <div className="mb-3">
            <span className="font-semibold">User1:</span> Hello, how can I solve this problem?
          </div>
          <div className="mb-3">
            <span className="font-semibold">User2:</span> Try starting with a basic function.
          </div>
          {/* Add more messages here */}
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="p-4 bg-blue-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">AI Chat History</h2>
        <div className="p-3 bg-white rounded-md">
          <p>AI Assistant: You could optimize this function by...</p>
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;

