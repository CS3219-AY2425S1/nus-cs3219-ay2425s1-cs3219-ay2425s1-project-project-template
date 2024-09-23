import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import { login } from '../../authentication/AuthService';
import signupGraphic from '../../assets/images/signup_graphic.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h1>Welcome back!</h1>
          <p>Log in to resume your unlimited access to practice questions.</p>

          <form onSubmit={handleLogin}>
            <label id="email" htmlFor='email'>Email*</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required></input>
            <label htmlFor='password'>Password*</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required></input>
            <div className="extras">
              <label className="remember-me">
                <input name="checkbox" type="checkbox" />Remember me
                <a href="#" className="forgot-password">Forgot Password?</a>
              </label>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          <p>
            Don't have an account? <a href="#">Sign Up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setErrorMessage(arg0: string) {
  throw new Error('Function not implemented.');
}

