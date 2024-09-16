// src/components/QuestionTable.js

import React from "react";

const QuestionTable = ({ questions }) => {
  return (
    <div>
      <h1>Question Table</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Title</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Category
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Complexity
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {question.title}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {question.category}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {question.complexity}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button>Edit</button>
                <button>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;
