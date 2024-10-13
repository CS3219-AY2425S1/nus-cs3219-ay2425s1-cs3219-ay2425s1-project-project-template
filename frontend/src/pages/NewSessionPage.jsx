import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

import loading from "../assets/loading.svg";
import "./styles/NewSessionPage.css";

const NewSessionPage = () => {
  const navigate = useNavigate();
  const [topicsArray, setTopicsArray] = useState([]);

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
  
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8080/questions", {
          method: "GET",
          headers: getHeaders(),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        getTopics(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
  
    fetchQuestions();
  }, []);

  const getTopics = (questions) => {
    const topicCount = [];

    questions.forEach(qn => {
      const topicArr = qn.category;

      topicArr.forEach(tp => {
        if (topicCount[tp]) {
            topicCount[tp]++;
        } else {
            topicCount[tp] = 1;
        }
      });
    });
  
    const topics = Object.keys(topicCount).map(topic => ({
        name: topic,
        count: topicCount[topic]
    }));

    topics.sort((a, b) => a.name.localeCompare(b.name));
    setTopicsArray(topics);
  };

  return (
    <div className="session-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>Back</button>
        <div className="session-selection">
            <p>Start a New Session</p>
            <form className="session-form" action="">
                <div className="difficulty-selection">
                    <p>Select a Difficulty Level:</p>
                    <div className="options">
                      <input type="radio" id="easy" name="difficulty" value="easy" />
                      <label className="radio-label" htmlFor="easy">Easy</label>
                      <input type="radio" id="medium" name="difficulty" value="medium" />
                      <label className="radio-label" htmlFor="medium">Medium</label>
                      <input type="radio" id="hard" name="difficulty" value="hard" />
                      <label className="radio-label" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className="topic-selection">
                    <p>Select a Topic:</p>
                    <div className="options">
                      {
                        topicsArray.length === 0 ? (
                          <img src={loading} alt="Loading..." />
                        ) : (
                          topicsArray.map((topic) => (
                            <React.Fragment key={topic.name}>
                              <input
                                type="radio"
                                id={topic.name}
                                name="topic"
                                value={topic.name}
                              />
                              <label className="radio-label" htmlFor={topic.name}>
                                {`${topic.name} (${topic.count})`}
                              </label>
                            </React.Fragment>
                          ))
                        )
                      }
                    </div>
                </div>
                <button className="start-btn">Start Matching</button>
            </form>
        </div>
    </div>
  );
};

export default NewSessionPage;
