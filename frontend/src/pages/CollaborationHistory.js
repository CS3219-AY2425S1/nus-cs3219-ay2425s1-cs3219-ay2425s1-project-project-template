import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Collaboration.css';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export const CollaborationHistory = () => {

  const [text1, setText1] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  const textAreaStyle = {
    display: 'block',
    width: '98%',
    height: '100px',
    marginBottom: '10px',
    padding: '8px',
  };

  useEffect(() => {
    getAttempt(params.username, params.attemptid);
  }, []);

  const getAttempt = async (username, attemptid) => {
    try {
      const response = await axios.get(`http://localhost:5002/attempts/${username}/${attemptid}`);
      setText1(response.data.attempt.attempts[0].text);
      setCode(response.data.attempt.attempts[0].code);
      setLanguage(response.data.attempt.attempts[0].language);
      setTitle(response.data.attempt.attempts[0].title);
      setQuestion(response.data.attempt.attempts[0].question);
      console.log(response.data.attempt.attempts[0]);
    } catch (error) {
      console.log(`Error in retrieving attempt data! ${error}`)
    }
  }

  const handleHomeButton = (e) => {
    navigate("/home");
  }

  return (
    <div className="collaboration-container">
      <div className="question-and-whiteboard">
        <div className="home-btn-container">
          <h2 className="subheading">Question</h2>
          <FontAwesomeIcon icon={faHome} style={{fontSize: "32px", color: "#F7B32B", cursor: "pointer"}} title="Return to homepage" 
            onClick={handleHomeButton}>        
          </FontAwesomeIcon>
        </div>
        <div className="question-box">
          <h3 className='questionTitle'>{title}</h3>
          <h3 className='questionText'>{question}</h3>
        </div>
        <div className="whiteboard">
          <div>
            <h2 className="subheading">Whiteboard</h2>
            <textarea
              style={textAreaStyle}
              value={text1}
              readOnly
              />
            <h2 className="subheading">Code Editor</h2>
            <div className="code-area">
              <select style={{padding: "5px"}} value={language} disabled>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="SQL">SQL</option>
              </select>
              <textarea style={textAreaStyle} value={code} readOnly></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}