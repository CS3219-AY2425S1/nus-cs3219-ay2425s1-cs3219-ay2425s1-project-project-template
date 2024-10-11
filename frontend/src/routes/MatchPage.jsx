import React, { useEffect, useState } from 'react';
import './MatchPage.css';
import { toast } from 'react-toastify';

function MatchPage() {

  const apiurl = process.env.REACT_APP_QUESTION_API_URL;
  const [questions, updateQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(apiurl, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();

        // Transform the response object into an array
        const arrayData = Object.values(data); // Use data, not jsonData
        updateQuestions(arrayData);
      }
    } catch (error) {
      toast.error('Something went wrong. Failed to fetch questions')
      updateQuestions([]);
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, []);

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
