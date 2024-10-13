import "../styles/Match.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from '../PeerPrep_logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUserCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const topics = ["Algorithms", "Arrays", "Bit Manipulation", "Brainteaser", "Databases", "Data Structures", "Recursion", "Strings"]
const difficulties = ["Easy", "Medium", "Hard"]

export const Match = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer
  useEffect(() => {
    let interval;
    if (isMatching && timer < 30) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (timer === 30) {
      stopMatching(); // Stop matching after 30 seconds
    }
    return () => clearInterval(interval); // Cleanup on unmount or timer stop
  }, [isMatching, timer]);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleProfileButton = (e) => {
    navigate("/profile");
  }

  const startMatching = async(e) => {
    e.preventDefault();
    if (!selectedTopic || !selectedDifficulty) {
      alert('Please choose a topic and difficulty level.')
      return;
    }
    setIsMatching(true);
    setTimer(0); // Reset the timer to 0
  };

  const stopMatching = () => {
    setIsMatching(false);
    setTimer(0); // Reset the timer when matching stops
  };

  return (
    <div className="match">
      {/* Menu Bar */}
      <nav className="menu-bar">
        <img src={logo} alt="PeerPrep" className="logo" />
        <FontAwesomeIcon icon={faUserCircle} className="profile-icon" style={{cursor: "pointer"}} onClick={handleProfileButton} />
      </nav>
   
      {/* Main Content */}
      <div className="main-container">
        {/* Topics */}
        <div className="topics-container"> 
          <h2>Choose ONE topic</h2>
          <ul>
            {topics.map((topic, index) => (
              <li
                key={index}
                className={selectedTopic === topic ? "selected" : ""}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </li>       
            ))}
          </ul>
        </div>
     
        {/* Difficulty */}
        <div className="difficulty-container">
          <h2>Choose ONE Difficulty level</h2>
          <ul>
            {difficulties.map((difficulty, index) => (
              <li
                key={index}
                className={selectedDifficulty === difficulty ? "selected" : ""}
                onClick={() => handleDifficultyClick(difficulty)}
              >
                {difficulty}
                {difficulty === "Easy" && (
                  <>
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </>
                )}
                {difficulty === "Medium" && (
                  <>
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </>
                )}
                {difficulty === "Hard" && (
                  <>
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </>
                )}
              </li>           
            ))}
          </ul>
        </div>
 
        {/* Match Button and Timer */}
        <div className="match-button-container">
          {isMatching && (
            <div className="timer">
              <p>Matching in progress... {timer}s</p>
              <FontAwesomeIcon icon={faSpinner} className="spin"/>
            </div>
          )}
          <button className="match-button" onClick={startMatching} disabled={isMatching}>
            Start Matching
          </button>
        </div>
      </div>
    </div>  
  );
};