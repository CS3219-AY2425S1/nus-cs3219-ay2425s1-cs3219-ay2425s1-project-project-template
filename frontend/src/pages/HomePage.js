import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const QUESTIONS_SERVICE_HOST = "http://localhost:3001/";

export const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const dummyData = [
    { id: 1, title: "Two Sum", category: "Array", complexity: "Easy" },
    {
      id: 2,
      title: "Add Two Numbers",
      category: "Linked List",
      complexity: "Medium",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      category: "String",
      complexity: "Medium",
    },
    {
      id: 4,
      title: "Valid Parentheses",
      category: "Stack",
      complexity: "Easy",
    },
    {
      id: 5,
      title: "Merge Two Sorted Lists",
      category: "Linked List",
      complexity: "Easy",
    },
    {
      id: 6,
      title: "Search in Rotated Sorted Array",
      category: "Binary Search",
      complexity: "Medium",
    },
    {
      id: 7,
      title: "Climbing Stairs",
      category: "Dynamic Programming",
      complexity: "Easy",
    },
    { id: 8, title: "Maximum Subarray", category: "Array", complexity: "Easy" },
    {
      id: 9,
      title: "Product of Array Except Self",
      category: "Array",
      complexity: "Medium",
    },
    {
      id: 10,
      title: "Top K Frequent Elements",
      category: "Heap",
      complexity: "Medium",
    },
  ];

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${QUESTIONS_SERVICE_HOST}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${QUESTIONS_SERVICE_HOST}/questions/${id}`);
      console.log(`Question with id ${id} deleted successfully.`);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const goToQuestion = (id) => {
    console.log("Navigating to question " + id);
    navigate(`/questions/${id}`);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p className="welcome-text">Welcome to PeerPrep</p>

        <table className="App-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Complexity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item) => (
              <tr key={item.id}>
                <td>
                  <span
                    onClick={() => goToQuestion(item.id)}
                    style={{ color: "black", cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "darkblue";
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "black";
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    {item.title}
                  </span>
                </td>
                <td>{item.category}</td>
                <td>{item.complexity}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteQuestion(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="create-btn">Create</button>
      </header>
    </div>
  );
};
