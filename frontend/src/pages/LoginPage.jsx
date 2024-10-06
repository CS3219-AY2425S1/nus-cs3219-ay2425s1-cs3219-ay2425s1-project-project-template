/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons from react-icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic (API call to authenticate user)

    // We assume login is always successful for now
    // Check the email and password here
    navigate('/dashboard'); // Navigate to the dashboard after successful login
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem' }}>PeerPrep</h1> 
      <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Welcome Back! Let's get started.</p> 
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: 'block',
            margin: '10px 0',
            padding: '10px', 
            width: '300px', // Input width
            border: 'none', // No border
            borderBottom: '2px solid #fff', // Bottom border to create line effect
            outline: 'none',
            backgroundColor: 'transparent', // No background color
            color: '#fff', // Text color to white
            fontSize: '16px', // Font size
          }}
        />
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px', // Padding reduced for line effect
              width: '100%', // Input width
              border: 'none', // No border
              borderBottom: '2px solid #fff', // Bottom border to create line effect
              outline: 'none',
              backgroundColor: 'transparent', // No background color
              color: '#fff', // Text color to white
              fontSize: '16px', // Same font size for consistency
            }}
          />
          {/* Eye icon for showing/hiding password */}
          <div
            onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show/hide icon */}
          </div>
        </div>
        <p style={{ margin: '0', color: 'white', fontSize: '0.9rem', textAlign: 'right', width: '300px' }}>
          <a href="/forget-password" style={{ color: 'white' }}>Forgot your password?</a> 
        </p>
        <button
          type="submit"
          style={{
            width: '300px', 
            height: '50px', 
            backgroundColor: 'white', // Button color 
            color: 'black', // Text color 
            border: 'none',
            borderRadius: '20px', // Curved button
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px',
          }}
        >
          Login
        </button>
      </form>
      <p style={{ fontSize: '1rem' }}> {/* Increased font size for Sign Up prompt */}
        Don't have an account? <a href="/signup" style={{ color: 'white' }}>Sign Up</a>
      </p>
    </div>
  );
};

const styles = `
  input::placeholder {
    color: white; 
    opacity: 0.8; 
  }
`;

// Append styles to the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Login;
