import React, { useState } from 'react';
import { register, UserCredentials } from './authService';
import RegistrationView from './RegistrationView';
import { useNavigate } from "react-router-dom";


const RegistrationController: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleRegistration = async (username: string, email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const userCredentials: UserCredentials = {
      username,
      email,
      password
    };

    try {
      const response = await register(userCredentials);
      console.log("Registration successful:", response);
      navigate("/questions")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage("Registration failed: " + error.message);
      } else {
        setErrorMessage("Registration failed: Unknown error");
      }
    }
  };

  const handleLoginRedirect = () => {
    console.log("Navigating to login page...");
    navigate("/login")
  };

  return (
    <RegistrationView 
      onSubmit={handleRegistration} 
      onLogin={handleLoginRedirect} 
      errorMessage={errorMessage} 
    />
  );
};

export default RegistrationController;