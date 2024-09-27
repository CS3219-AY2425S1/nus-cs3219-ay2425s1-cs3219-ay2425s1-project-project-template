import React from "react";
import { useNavigate } from 'react-router-dom';
import { login, UserCredentials } from "./authService";
import LoginView from "./LoginView";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const LoginController: React.FC = () => {
  //const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate(); 

  const handleLogin = async (email: string, password: string) => {
    const credentials: UserCredentials = { email, password };
    try {
      const token = await login(credentials);
      toast.success("Logged in successfully!"); 
      console.log("Logged in successfully! Token:", token);
      setTimeout(() => {
        navigate("/questions");
      }, 1000);
    } catch (error: unknown) {
      //setErrorMessage(error || "Login failed: Invalid email or password.");
      if (error instanceof Error) {
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