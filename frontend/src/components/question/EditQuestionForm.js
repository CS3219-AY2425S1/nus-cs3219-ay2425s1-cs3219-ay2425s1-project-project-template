// src/components/EditQuestionForm.js
import React, { useState, useEffect } from "react";

const EditQuestionForm = ({ question, onUpdate }) => {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);
  const [category, setCategory] = useState(question.category);
  const [complexity, setComplexity] = useState(question.complexity);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State for error message

  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description);
    setCategory(question.category);
    setComplexity(question.complexity);
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate complexity
    if (!["Easy", "Medium", "Hard"].includes(complexity)) {
      setError("Complexity must be one of: Easy, Medium, Hard");
      return;
    } else {
      setError(""); // Clear error if validation passes
    }

    setIsLoading(true);
    await onUpdate({ ...question, title, description, category, complexity });
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "700px", // Fixed width
        height: "700px", // Fixed height
        margin: "0 auto",
        padding: "20px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ marginBottom: "5px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "5px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              height: "200px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "5px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "5px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Complexity:
          <input
            type="text"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        {error && <div style={{ color: "red", fontSize: "12px" }}>{error}</div>}{" "}
        {/* Error message */}
      </div>
      <div style={{ marginBottom: "20px" }}>
        {" "}
        {/* Div for margin */}
        <button
          type="submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isLoading}
          style={{
            padding: "12px 15px", // Button padding
            backgroundColor: isHovered ? "#ff80b3" : "#ffb3d9",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            lineHeight: "1.5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {isLoading ? "Updating..." : "Update Question"}
        </button>
      </div>
    </form>
  );
};

export default EditQuestionForm;
