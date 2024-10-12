import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./styles/NewSessionPage.css";

const NewSessionPage = () => {
  const navigate = useNavigate();

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
                      <input type="radio" id="array" name="topic" value="Array" />
                      <label className="radio-label" htmlFor="array">Array</label>
                      <input type="radio" id="string" name="topic" value="String" />
                      <label className="radio-label" htmlFor="string">String</label>
                    </div>
                </div>
                <button className="start-btn">Start Matching</button>
            </form>
        </div>
    </div>
  );
};

export default NewSessionPage;
