import React, { useState } from 'react';

const CurrentActiveSession = ({ hasActiveSession }) => {
  // State to manage button hover effect
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "#fff",
        padding: "20px",
        width: "300px",
        height: "200px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginRight: "20px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>Current Active Session</h2>
      <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
        {hasActiveSession
          ? "Current active session with ____"
          : "No active session. Ready for more?"}
      </p>
      <button
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          backgroundColor: isHovered ? "#005f76" : "#1a3042", // Change color on hover
          color: "#fff",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: '16px',
          fontFamily: 'Figtree, sans-serif', // Set font to Figtree
          transition: 'background-color 0.3s ease', // Smooth transition
        }}
        onMouseEnter={() => setIsHovered(true)} // Set hover state
        onMouseLeave={() => setIsHovered(false)} // Reset hover state
      >
        {hasActiveSession ? "Rejoin Session" : "New Question"}
      </button>
    </div>
  );
};

export default CurrentActiveSession;
