import React, { useState } from 'react';
import '../styles/Login.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('Registration successful');
        /*
        try {
            const response = await fetch('http://localhost:YOUR_BACKEND_PORT/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Handle success (e.g., redirect to a different page or show a success message)
                console.log('Login successful:', data);
            } else {
                // Handle error
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        */
    };

    return (
        <div className="login-container">
            <h1>Welcome Back to PeerPrep</h1>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <h3>Access your account</h3>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
