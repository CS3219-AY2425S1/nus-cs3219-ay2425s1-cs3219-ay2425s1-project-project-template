import React from "react";
import { useNavigate } from 'react-router-dom';
import { login, UserCredentials } from "./authService";
import LoginView from "./LoginView";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import axios, { AxiosError } from "axios";

interface LoginControllerProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginController: React.FC<LoginControllerProps> = ({setAuth}) => {
  //const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate(); 

  const handleLogin = async (email: string, password: string) => {
    const credentials: UserCredentials = { email, password };
    try {
      const token = await login(credentials);
      toast.success("Logged in successfully!"); 
      console.log("Logged in successfully! Token:", token);
      setAuth(true)
      setTimeout(() => {
        navigate("/questions");
      }, 1000);
    } catch (error: Error | AxiosError) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message || "Login failed: Invalid email or password.");
      } else {
        toast.error("Login failed: Invalid email or password.");
      }
    }
  };

  const handleCreateAccount = () => {
    console.log("Create account clicked");
    navigate("/register");
  };

  return (
    <>
    <ToastContainer /> 
    <LoginView
      onSubmit={handleLogin}
      onCreateAccount={handleCreateAccount}
    />
    </>
  );
};

export default LoginController;