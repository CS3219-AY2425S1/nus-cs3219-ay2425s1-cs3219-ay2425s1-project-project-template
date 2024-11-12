import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { QUESTIONS_SERVICE } from "../Services";

export const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${QUESTIONS_SERVICE}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${QUESTIONS_SERVICE}/questions/${id}`);
      console.log(`Question with id ${id} deleted successfully.`);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((item) => item.id !== id)
      );
      getQuestions()
    } catch (error) {
      console.log(error);
    }
  };

  const goToQuestion = (id) => {
    console.log("Navigating to question " + id);
    navigate(`/questions/${id}`);
  };

  const splitCategory = (categories) => {
    var output = "";
    for (const category of categories) {
      output += category + ", ";
    }
    // Removes the last comma
    return output.substring(0, output.length - 2);
  }

  const handleLogout = (e) => {
    localStorage.clear();
    navigate("/login");
  }

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageJump = (event) => {
    event.preventDefault();
    const targetPage = parseInt(event.target.pageInput.value, 10);
    if (targetPage >= 1 && targetPage <= totalPages) {
        setCurrentPage(targetPage);
    }
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
              {isAdmin ? <th>Actions</th> : null }
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((item) => (
              <tr key={item._id}>
                <td>
                  <span
                    onClick={() => goToQuestion(item.question_id)}
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
                <td>{splitCategory(item.category)}</td>
                <td>{item.complexity}</td>
                {isAdmin ? <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteQuestion(item._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td> : null}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>{`Page ${currentPage} / ${totalPages}`}</span>
          <button className="prev-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <FontAwesomeIcon className="prev-icon" icon={faChevronLeft} />
          </button>
          <button className="next-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <FontAwesomeIcon className="next-icon" icon={faChevronRight} />
          </button>
          <form className="jump-to-form" onSubmit={handlePageJump}>
                <label>Jump to</label>
                <input type="number" name="pageInput" min="1" max={totalPages} />
                <button type="submit">Go</button>
          </form>
        </div>

        <div className="button-div">
          {isAdmin ? <button className="create-btn" onClick={() => { goToQuestion("new") }}>Create</button> : null}
          <button className="create-btn" onClick={(e) => navigate("/match")}>Solve with a friend!</button>
          <button className="create-btn" onClick={(e) => navigate("/profile")}>Profile</button>
          <button className="create-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
    </div>
  );
};
