import React, { useState } from 'react';
import '../../styles/start-session.css';
import { topics } from "../../assets/topics";

const StartSession = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Python');

  const handleFindMatch = async () => {
    // Send a POST request to the backend to find a match
    const matchData = { difficulty, topic, language };

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
  };

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
    </div>
  );
};

export default StartSession;
