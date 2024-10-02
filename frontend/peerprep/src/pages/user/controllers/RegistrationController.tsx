import React from 'react';
import { register, UserCredentials } from '../authService';
import RegistrationView from '../views/RegistrationView';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationController: React.FC = () => {
  //const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleRegistration = async (username: string, email: string, password: string, confirmPassword: string) => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!"); 
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
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1000); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Registration failed: " + error.message);
      } else {
        toast.error("Registration failed: Unknown error");
      }
    }
  };

  const handleLoginRedirect = () => {
    console.log("Navigating to login page...");
    navigate("/login");
  };

  return (
    <>
    <ToastContainer />
    <RegistrationView 
      onSubmit={handleRegistration} 
      onLogin={handleLoginRedirect}
    />
    </>
  );
};

export default RegistrationController;