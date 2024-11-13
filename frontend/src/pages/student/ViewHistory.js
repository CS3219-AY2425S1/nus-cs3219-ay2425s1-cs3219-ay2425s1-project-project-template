import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";

const ViewHistory = () => {
  const { roomId } = useParams();
  const location = useLocation();

  // Access question from location.state
  const sessionData = location.state?.sessionData;
  
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
          value={sessionData?.code}  // Display the saved code
          options={{ readOnly: true, minimap: { enabled: false } }}  // Make it read-only and disable the minimap if desired
        />
      </div>
    </div>
  );
};

export default ViewHistory;

