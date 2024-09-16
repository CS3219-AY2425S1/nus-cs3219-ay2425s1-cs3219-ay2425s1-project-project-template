import React from "react";

const QuestionTable = ({ questions }) => {
  return (
    <div>
      <h1>Question Table</h1>
      <table>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;
