import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login, UserCredentials } from "./authService";
import LoginView from "./LoginView";

interface LoginControllerProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginController: React.FC<LoginControllerProps> = ({setAuth}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate(); 

  const handleLogin = async (email: string, password: string) => {
    const credentials: UserCredentials = { email, password };
    try {
      const token = await login(credentials);
      console.log("Logged in successfully! Token:", token);
      setAuth(true)
      navigate("/questions");
    } catch (error: any) {
      setErrorMessage(error || "Login failed: Invalid email or password.");
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