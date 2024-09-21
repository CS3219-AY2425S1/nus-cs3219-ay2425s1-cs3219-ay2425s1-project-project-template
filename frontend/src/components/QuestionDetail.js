import React, { useState } from "react";

const QuestionDetail = ({ question, onClose }) => {
  const [isHovered, setIsHovered] = useState(false); // State for hover

  return (
    <div
      style={{
        width: "600px", // Fixed width
        height: "400px", // Fixed height
        margin: "20px auto",
        padding: "20px",
        // border: "1px solid #ccc",
        // borderRadius: "5px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        overflowY: "auto", // Scrollable content if it exceeds the fixed height
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>
        {question.title}
      </h1>
      <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
        Category:{" "}
        <span style={{ fontWeight: "normal" }}>{question.category}</span>
      </p>
      <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
        Complexity:{" "}
        <span style={{ fontWeight: "normal" }}>{question.complexity}</span>
      </p>
      <h2 style={{ fontSize: "20px", marginTop: "20px", color: "#666" }}>
        Description:
      </h2>
      <p style={{ lineHeight: "1.6", color: "#444" }}>{question.description}</p>

      <button
        onClick={onClose} // Call the onClose function passed from the parent
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: "12px 15px",
          backgroundColor: isHovered ? "#ff80b3" : "#ffb3d9",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: "1.5",
          display: "block",
          margin: "70px auto 0",
          width: "100%",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default QuestionDetail;
