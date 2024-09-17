// src/components/QuestionDetail.js
import React from "react";

const QuestionDetail = ({ question }) => {
  return (
    <div>
      <h1>{question.title}</h1>
      <p>Category: {question.category}</p>
      <p>Complexity: {question.complexity}</p>
      <p>Description: {question.description}</p>
    </div>
  );
};

export default QuestionDetail;
