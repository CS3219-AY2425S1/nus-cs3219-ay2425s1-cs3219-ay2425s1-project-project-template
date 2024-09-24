import React, { useState } from "react";
import { Link } from "react-router-dom";
import useQuestions from "../hooks/useQuestions";
import "./QuestionList.css";

const QuestionList: React.FC = () => {
  const { questions, loading, error } = useQuestions();
  const [search, setSearch] = useState("");

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="question-list-container">
      <div className="search-bar">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="question-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((question) => (
            <tr key={question.id}>
              <td>
                <Link to={`/questions/${question.id}`}>{question.title}</Link>
              </td>
              <td>
                <span
                  className={`difficulty ${question.difficulty.toLowerCase()}`}
                >
                  {question.difficulty}
                </span>
              </td>
              <td>{question.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionList;
