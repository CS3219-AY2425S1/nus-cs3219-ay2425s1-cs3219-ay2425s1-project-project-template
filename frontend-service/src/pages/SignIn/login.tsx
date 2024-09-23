import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
import { login } from '../../authentication/AuthService';
import '../../assets/images/signup_graphic.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(`Login failed: ${error.message}`);
      console.error('Login Error:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Sign In</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username or Email" required></input>
      <input type="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setErrorMessage(arg0: string) {
  throw new Error('Function not implemented.');
}

