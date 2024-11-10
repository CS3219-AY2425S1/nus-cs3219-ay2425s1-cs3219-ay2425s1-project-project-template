import React, { useState } from 'react';
import '../styles/Register.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER_SERVICE } from '../Services';

export const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const regexPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    } else if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
        alert('Please fill out all fields!');
        return;
    } else if (!regexPattern.test(password)) {
        console.log(password);
        alert("Please include 8-16 characters, 1 number, 1 uppercase and 1 lowercase letter in your password");
    } else {
      try {
        const response = await axios.post(`${USER_SERVICE}/users/create`, {
          username: username,
          email: email,
          password: password
        });
        if (response.status === 201) {
          alert('Successfully created user!');
          localStorage.setItem("userId", response.data.data.id);
          localStorage.setItem("accessToken", response.data.data.accessToken);
          localStorage.setItem("username", response.data.data.username);
          localStorage.setItem("email", response.data.data.email);
          navigate("/home");
        } else {
          alert('Unable to create user.');
        }
      } catch (error) {
        console.log(error.response);
        if (error.response.data.message === "username or email already exists") {
          alert('Username or email already exists!');
        } else {
          alert('An error occurred!');
        }
      }
    }
  };

  return (
    <div className="register-container">
      <h1>Welcome to PeerPrep</h1>
      <form onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <h3>Create your account</h3>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};