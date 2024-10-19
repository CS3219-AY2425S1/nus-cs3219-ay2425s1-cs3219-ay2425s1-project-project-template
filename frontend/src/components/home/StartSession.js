import React, { useState, useEffect } from 'react';
import '../../styles/start-session.css';
import { topics } from "../../assets/topics";
import MatchPopup from "./MatchPopup";

const StartSession = ({ username }) => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Python');
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [matchFound, setMatchFound] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  const handleFindMatch = async () => {
    // Send a POST request to the backend to find a match
    const matchData = { username, difficulty, topic, language };

    try {
      const response = await fetch('http://localhost:3002/api/find-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Match request sent:', result);
      } else {
        console.error('Error finding match:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }

    // Show the popup and start the countdown
    setShowPopup(true);
    setCountdown(30);
  };

  const closePopup = async () => {
    setShowPopup(false);
  
    // Notify the backend to remove the user from the queue
    try {
      const response = await fetch('http://localhost:3002/api/cancel-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Send the username to identify the user
      });
  
      if (response.ok) {
        console.log('User removed from queue');
      } else {
        console.error('Failed to remove user from queue');
      }
    } catch (error) {
      console.error('Error cancelling match:', error);
    }
  };
  

  useEffect(() => {
    let timer;
    if (showPopup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000); // Decrease countdown every second
    }

    if (countdown === 0) {
      setShowPopup(false); // Automatically close dialog when countdown is 0
    }

    return () => clearInterval(timer);
  }, [showPopup, countdown]);

  // WebSocket to listen for match events
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3002'); // Backend WebSocket endpoint
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.matchFound && data.matchedUser) {
        setMatchFound(true);
        setMatchedUser(data.matchedUser);
        setShowPopup(true); // Ensure popup remains open when match is found
      }
    };
  
    return () => ws.close(); // Clean up WebSocket on component unmount
  }, []);

  return (
    <div className="start-session-container">
      <div className="session-header">
        <h2>Start a Session</h2>
      </div>
      <div className="session-form">
        <p>
          To begin a session, choose your preferred difficulty, topic, and programming language. <br />
          If someone in the queue has the same preference as you, you will be matched. <br />
          (Note: you will be timed out after 30s if there are no matches) Happy coding :)
        </p>
        <div className="form-group">
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label>Topic</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((topic, index) => (
                <option key={index} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Java">Java</option>
          </select>
        </div>
        <button onClick={handleFindMatch}>Find a Match</button>
      </div>

      {/* Render the MatchPopup component */}
      <MatchPopup 
        countdown={countdown}
        showPopup={showPopup}
        closePopup={closePopup}
        matchFound={matchFound}
        matchedUser={matchedUser} />
    </div>
  );
};

export default StartSession;
