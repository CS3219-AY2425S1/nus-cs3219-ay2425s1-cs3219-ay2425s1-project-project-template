import React, { useState } from 'react';

import { Link } from 'react-router-dom'

import styles from './RegisterPage.module.css'; 

const RegisterPage = () => {
    //const { handleLogin, isLoading, isInvalidLogin } = useLogin();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Add simple validation
    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, confirmPassword } = formData;
        if (!email || !password || !confirmPassword) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        // Call the handleLogin function here once the registration logic is implemented
        // handleLogin(email, password);
        console.log("Registration successful!"); // Placeholder for successful registration
    };

    return (
        <div className={styles.registerContainer}> 
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className={styles.registerForm}> 
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                {/* {isLoading && <p>Loading...</p>}
                {isInvalidLogin && <p className={styles.errorMessage}>Invalid resgistration credentials, please try again.</p>}
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} */}
                <button type="submit" className={styles.registerButton} >
                    {/* {isLoading ? 'Registering...' : 'Login'} */}
                    Register
                </button>
            </form>
            <Link to={`/login`}> Login here </Link>
        </div>
    );
};

export default RegisterPage;
