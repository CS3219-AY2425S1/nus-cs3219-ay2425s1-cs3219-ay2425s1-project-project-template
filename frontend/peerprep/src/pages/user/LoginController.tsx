import React, { useState } from "react";
import { login, UserCredentials } from "./authService";
import LoginView from "./LoginView";
import { useNavigate } from "react-router-dom";

const LoginController: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const credentials: UserCredentials = { email, password };
    try {
      const token = await login(credentials);
      console.log("Login successful! Token:", token);
      navigate("/register"); // changed to questions
    } catch (error) {
      setErrorMessage("Login failed: Invalid email or password.");
    }
  };

  const handleCreateAccount = () => {
    console.log("Create account clicked");
    navigate("/register");
  };

  return (
    <LoginView
      onSubmit={handleLogin}
      onCreateAccount={handleCreateAccount}
      errorMessage={errorMessage}
    />
  );
};

export default LoginController;