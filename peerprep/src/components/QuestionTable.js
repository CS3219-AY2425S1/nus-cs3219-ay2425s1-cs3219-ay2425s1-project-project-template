// src/components/QuestionTable.js
import React from "react";
import "./QuestionTable.css"; // Import the CSS file

const QuestionTable = ({ questions }) => {
  return (
    <div>
      <h1></h1>
      <table className="table-custom">
        {" "}
        {/* Apply custom table class */}
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Complexity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.title}</td>
              <td>{question.category}</td>
              <td>{question.complexity}</td>
              <td>
                <button>Edit</button>
                <button>View</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;
