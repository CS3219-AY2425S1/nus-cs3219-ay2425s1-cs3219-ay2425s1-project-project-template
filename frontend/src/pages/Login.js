import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        if (email === '' || password === '') {
            alert('Please fill out all fields!');
            return;
        } else {
            try {
                const response = await axios.post('http://localhost:3002/auth/login', {
                    email: email,
                    password: password,
                });
                if (response.status === 200) {
                    alert('Successfully logged in!');
                } else {
                    alert('Unable to log in.');
                }
            } catch (error) {
                if (error.response.status === 401) {
                    alert('Invalid username or password!');
                } else {
                    alert('An error occurred!');
                }
            }
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome Back to PeerPrep</h1>
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
        </div>
    );
};
