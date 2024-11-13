// Author(s): Andrew
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGatewaySocket } from "../../config/socket";
import "./styles/Select.css";
import NavBar from "../../components/NavBar";
import useSessionStorage from "../../hook/useSessionStorage";

function Select() {
  const navigate = useNavigate();
  
  const email = useSessionStorage("", "email")[0];
  // const token = useSessionStorage("", "token")[0];
  // const username = useSessionStorage("", "username")[0];
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  

  const [errorMessage, setErrorMessage] = useState({
    topic: '',
    difficultyLevel: ''
  });

  const [formData, setFormData] = useState({
    topic: '',
    difficultyLevel: '',
    email: '',
    token: '',
    isAny: false
  });

  const difficultyLevelOptions = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" }
  ];

  const topicOptions = [
    { label: "Databases", value: "Databases" },
    { label: "Algorithms", value: "Algorithms" },
    { label: "Data Structures", value: "Data Structures" }
  ];

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(`${formData.topic}, ${formData.difficultyLevel}`);

    let newErrorMessage = {};

    if (formData.topic === "") {
      newErrorMessage.topic = "Please select a topic";
    } else {
      delete newErrorMessage.topic;
    }

    if (formData.difficultyLevel === "") {
      newErrorMessage.difficultyLevel = "Please select a difficulty level";
    } else {
      delete newErrorMessage.difficultyLevel;
    }

    setErrorMessage(newErrorMessage);

    if (Object.keys(newErrorMessage).length === 0) {
      const updatedFormData = {
        ...formData,
        email: email,
        token: email,
        username: email,
      };

      // Emit a message to the server when submitting
      apiGatewaySocket.emit("join_matching_queue", updatedFormData);

      navigate(`/matching/findingmatch`, { state: updatedFormData });
    }
  };

  return (
    <div id="selectPageContainer" className="container">
      <NavBar />
      <div id="SelectFormContainer">
        <h1>Selection</h1>
        <form onSubmit={handleSubmit}>
          <div className='formGroup'>
            <label htmlFor='topic'><strong>Topic</strong></label>
            <select name='topic' value={formData.topic} onChange={handleInput} className="dropdown">
              <option value="">Select Topic</option>
              {topicOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMessage.topic && <span className='errorLabel'>{errorMessage.topic}</span>}
          </div>

          <div className='formGroup'>
            <label htmlFor='difficultyLevel'><strong>Difficulty Level</strong></label>
            <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleInput} className="dropdown">
              <option value="">Select Difficulty Level</option>
              {difficultyLevelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMessage.difficultyLevel && <span className='errorLabel'>{errorMessage.difficultyLevel}</span>}
          </div>

          <button type="submit">Find match</button>
        </form>
      </div>
    </div>
  );
}

export default Select;
