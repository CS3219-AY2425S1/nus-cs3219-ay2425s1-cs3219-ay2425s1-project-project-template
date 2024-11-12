import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { USER_SERVICE } from '../Services';

export const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        if (email === '' || password === '') {
            alert('Please fill out all fields!');
            return;
        } else {
            try {
                const response = await axios.post(`${USER_SERVICE}/auth/login`, {
                    email: email,
                    password: password,
                });
                if (response.status === 200) {
                    localStorage.setItem("userId", response.data.data.id);
                    localStorage.setItem("accessToken", response.data.data.accessToken);
                    localStorage.setItem("username", response.data.data.username);
                    localStorage.setItem("email", response.data.data.email);
                    localStorage.setItem("isAdmin", response.data.data.isAdmin);
                    alert('Successfully logged in!');
                    onLoginSuccess();
                    navigate("/home");
                } else {
                    alert('Unable to log in.');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Invalid username or password!');
                } else {
                    alert('An error occurred!');
                }
            }
        }
    };

    const goToSignup = (e) => {
        navigate("/signup");
    }

    return (
        <div className="login-container">
            <h1>Welcome Back to PeerPrep</h1>
            <div className="login-white">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <h3>Access your account</h3>
                    <label>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                <div className="register-div">
                    <div>Don't have an account?</div>
                    <button className="register-button" onClick={goToSignup}>Register</button>
                </div>
            </div>
        </div>
    );
};
