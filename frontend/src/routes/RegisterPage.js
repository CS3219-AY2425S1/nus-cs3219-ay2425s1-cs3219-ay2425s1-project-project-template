import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; 

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Perform registration logic here (e.g., create a new user)
    navigate('/', { state: { registered: true } }); // Redirect to the login page with state
  };

  return (
    <div className="register-container">
      <div className="header">
        <h1 className="main-header">PeerPrep</h1>
        <h2 className="sub-header">Register to start learning</h2>
      </div>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
