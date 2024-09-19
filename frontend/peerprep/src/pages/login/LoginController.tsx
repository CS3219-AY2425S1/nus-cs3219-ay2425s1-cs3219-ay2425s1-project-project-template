// controllers/LoginController.tsx
import React, { useState } from "react";
import { login, UserCredentials } from "./authService";
import LoginView from "./LoginView";

const LoginController: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (credentials: UserCredentials) => {
    try {
      const token = await login(credentials);
      console.log("Logged in successfully! Token:", token);
      // Save the token or redirect to a protected route
    } catch (error) {
      setErrorMessage("Login failed: Invalid username or password.");
    }
  };

  return <LoginView onSubmit={handleLogin} errorMessage={errorMessage} />;
};

export default LoginController;
