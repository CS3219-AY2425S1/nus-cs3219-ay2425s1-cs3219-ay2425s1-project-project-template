import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login, UserCredentials } from "./authService";
import LoginView from "./LoginView";

const LoginController: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate(); 

  const handleLogin = async (username: string, password: string) => {
    const credentials: UserCredentials = { username, password };
    try {
      const token = await login(credentials);
      console.log("Logged in successfully! Token:", token);
    } catch (error) {
      setErrorMessage("Login failed: Invalid username or password.");
    }
    navigate('/questions');
  };

  return <LoginView onSubmit={handleLogin} errorMessage={errorMessage} />;
};

export default LoginController;