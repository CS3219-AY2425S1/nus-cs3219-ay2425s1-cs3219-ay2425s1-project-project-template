import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import './assets/images/signup_graphic.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Sign In</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username or Email"></input>
      <input type="email" value={password} onChange={(p) => setPassword(p.target.value)} placeholder="Password"></input>
      <button type="submit">Login</button>
      <div style={{ marginTop: '10px' }}>
        <a href="#" style={{ color: 'blue', textDecoration: 'underline' }}>
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default Login;