// src/services/authService.ts  
import { useMutation } from "@tanstack/react-query";
import axios from "@/utils/axios";
import { AxiosError } from "axios";

// Define the shape of the login response
interface LoginResponse {   
  accessToken: string;
  id: string;
  username: string;
  email: string;    
  isAdmin: boolean;
  createdAt: string;
}

// Define the credentials object
interface Credentials {
  email: string;
  password: string;
}

// Login: Send credentials to the server and return the response
const login = async (credentials: Credentials): Promise<LoginResponse> => {
  const response = await axios.post("/user-service/auth/login", credentials);
  return response.data.data;
};  

// Login hook
export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError, Credentials>({
    mutationFn: login,
    onSuccess: (data) => {
      // Store the accessToken in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      console.log("Login successful!", data);
      // Redirect if needed here
    },
    onError: (error) => {
      console.error("Login failed", error);
      throw error.message || "Login failed!";
    },
  });
};
