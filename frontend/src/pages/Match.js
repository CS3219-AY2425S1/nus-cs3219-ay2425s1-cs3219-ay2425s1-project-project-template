import "../styles/Match.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../PeerPrep_logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUserCircle,
  faSpinner,
  faHome
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
import { NOTIFICATION_SERVICE, MATCHING_SERVICE } from "../Services";

const userId = localStorage.getItem("userId");
const topics = [
  "Algorithms",
  "Arrays",
  "Bit Manipulation",
  "Brainteaser",
  "Databases",
  "Data Structures",
  "Recursion",
  "Strings",
];
const difficulties = ["Easy", "Medium", "Hard"];

export const Match = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(false);
  const [socket, setSocket] = useState(null);
  const [timer, setTimer] = useState(0);

  // Timer that waits for 30s before calling stopMatching
  useEffect(() => {
    let interval;
    let startTime;

    if (isMatching) {
      startTime = Date.now();

      // Update timer every second for 60s
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimer(elapsed);

        if (elapsed >= 60) {
          stopMatching();
          alert(
            "Couldn't find anyone to match you with at this time...please try again."
          );
          console.log("Cancelling match");
        }
      }, 1000);
    } else {
      setTimer(0); // Reset timer when not matching
    }
    return () => clearInterval(interval); // Cleanup interval
  }, [isMatching]);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleLogoClick = (e) => {
    navigate("/home");
  };

  const handleProfileButton = (e) => {
    navigate("/profile");
  };

  const handleHomeButton = (e) => {
    navigate("/home");
  }

  const startMatching = async (e) => {
    e.preventDefault();
    if (!selectedTopic || !selectedDifficulty) {
      alert("Please choose a topic and difficulty level.");
      return;
    }
    setIsMatching(true);
    setTimer(0);

    try {
      const socket = await io(NOTIFICATION_SERVICE, {
        query: { role: "user", user_id: userId },
        transports: ["websocket"],
      });

      const response = await axios.post(
        `${MATCHING_SERVICE}/enqueue`,
        {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
          userId: userId,
          cancel: false
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response);

      setSocket(socket);
      socket.on("connect", () => {
        console.log("Connected to notification service!");
      });

      socket.on("notification", (data) => {
        sessionStorage.setItem("partner", data.match);
        alert(
          `You have been matched with ${data.match}!\n${data.match_message}`
        );
        sessionStorage.setItem("match_topic", data.match_topic);
        sessionStorage.setItem("match_difficulty", data.match_difficulty);
        completeMatching();
      });

      socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
        setIsMatching(false);
      });
    } catch (error) {
      alert("An error occured while trying to match you with a peer.");
      console.error("Error:", error);
      stopMatching();
    }
  };

  const completeMatching = async () => {
    if (socket?.connected) socket.disconnect();
    setIsMatching(false);
    navigate("/collab");
    setTimer(0);
  }

  const stopMatching = async () => {
    if (socket?.connected) socket.disconnect();
    setIsMatching(false);
    setTimer(0);
    try {
      const response = await axios.post(
        `${MATCHING_SERVICE}/dequeue`,
        {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
          userId: userId,
          cancel: true
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        alert("Cancelled successfully!");
      } else {
        console.log("An error occured!");
        console.log(response)
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <div className="match">
      {/* Menu Bar */}
      <nav className="menu-bar">
        <img
          src={logo}
          alt="PeerPrep"
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
        <FontAwesomeIcon icon={faHome} style={{fontSize: "32px", color: "#F7B32B", cursor: "pointer"}} onClick={handleHomeButton} />        
        <FontAwesomeIcon
          icon={faUserCircle}
          className="profile-icon"
          style={{ cursor: "pointer" }}
          onClick={handleProfileButton}
        />
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
              <FontAwesomeIcon icon={faSpinner} className="spin" />
            </div>
          )}
          <button
            className="match-button"
            onClick={isMatching ? stopMatching : startMatching}
          >
            {isMatching ? "Cancel" : "Start Matching"}
          </button>
        </div>
      </div>
    </div>
  );
};
