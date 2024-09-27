import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login, UserCredentials } from "../authService";
import LoginView from "../views/LoginView";

const LoginController: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate(); 

  const handleLogin = async (email: string, password: string) => {
    const credentials: UserCredentials = { email, password };
    try {
      const token = await login(credentials);
      console.log("Logged in successfully! Token:", token);
      navigate("/questions");
    } catch (error: any) {
      setErrorMessage(error || "Login failed: Invalid email or password.");
    }
  };

  const handleCreateAccount = () => {
    console.log("Create account clicked");
    navigate("/register");
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password Clicked");
    navigate("/forget-password");
  };

  return (
    <LoginView
      onSubmit={handleLogin}
      onCreateAccount={handleCreateAccount}
      onForgotPassword={handleForgotPassword}
      errorMessage={errorMessage}
    />
  );
};

export default LoginController;