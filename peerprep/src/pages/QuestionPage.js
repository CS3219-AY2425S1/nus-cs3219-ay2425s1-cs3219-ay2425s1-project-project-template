// src/pages/QuestionPage.js
import React, { useState, useEffect } from "react";
import QuestionTable from "../components/QuestionTable";

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch or define your questions data here
    // For example:
    setQuestions([
      {
        id: 1,
        title: "Two Sum",
        category: "Array",
        complexity: "Easy",
      },
      {
        id: 2,
        title: "Three Sum",
        category: "Array",
        complexity: "Medium",
      },
      // Add more question objects as needed
    ]);
  }, []);

  return (
    <div>
      <h1></h1>
      <QuestionTable questions={questions} />
    </div>
  );
};

export default QuestionPage;
