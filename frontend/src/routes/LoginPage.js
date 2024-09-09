import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for state passed from the RegisterPage
    if (location.state?.registered) {
      setSuccessMessage('Account registered successfully!');
    }
  }, [location.state]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here (e.g., authenticate user)
    navigate('/code'); // Redirect to the code editor page
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1 className="main-header">PeerPrep</h1>
        <h2 className="sub-header">Where we learn together</h2>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        {successMessage && <p className="success-message">{successMessage}</p>}
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
        <button type="submit">Login</button>
        <div className="link-container">
          <p>Don't have an account? <a href="/register">Add a new account</a></p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
