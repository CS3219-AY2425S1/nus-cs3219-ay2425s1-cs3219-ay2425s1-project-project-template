import React, { useState } from 'react';
import './MatchPage.css';

function MatchPage() {
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState('Waiting for button to be pressed');

  const handleMatchClick = () => {
    setStatus('Matching...');
    // Simulate a delay for matching (e.g., API call)
    setTimeout(() => {
      setStatus('Match not found!');
    }, 2000);
  };

  return (
    <div className="match-container">
      <div className="diff">
        <div className="form-group">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="topic">
        <div className="form-group">
          <label>Topic:</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Select topic</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          </select>
      </div>
      </div>

      <div className="start">
        <button className="match-button" onClick={handleMatchClick}>
          Start Match
        </button>
      </div>

      <div className="status-display">
        {status}
      </div>
    </div>
  );
}

export default MatchPage;
