import React from 'react';
import { useNavigate } from 'react-router-dom';

const DailyChallenge = ({ dailyChallenge }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "#fff",
        padding: "20px",
        width: "400px",
        height: "200px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginTop: "40px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px' 
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>Daily Coding Challenge</h2>
      <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
        <strong>Difficulty:</strong> {dailyChallenge.difficulty}
      </p>
      <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
        <strong>Topic:</strong> {dailyChallenge.topic}
      </p>
      <button
        onClick={() => navigate('/new-session')}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2a4b5e'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#1a3042'}
        style={{
          marginTop: "20px",
          padding: "15px 30px",
          backgroundColor: '#1a3042',
          color: "#fff",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: '16px',
          fontFamily: 'Figtree',
          transition: "background-color 0.3s",
        }}
      >
        Try Challenge
      </button>
    </div>
  );
};

export default DailyChallenge;
