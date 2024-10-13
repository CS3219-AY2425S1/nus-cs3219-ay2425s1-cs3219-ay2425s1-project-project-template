import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axios from "@/utils/axios";
import {
  LoginResponse,
  Credentials,
  RegisterResponse,
  RegisterCredentials,
} from "@/types/auth";

// Login: Send credentials to the server and return the response
const login = async (credentials: Credentials): Promise<LoginResponse> => {
  const response = await axios.post("/user-service/auth/login", credentials);

  return response.data.data;
};

// Login hook
export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError, Credentials>({
    mutationFn: login,
    onSuccess: () => {
      console.log("Login successful!");
    },
    onError: () => {
      console.error("Login failed!");
    },
  });
};

// Registration: Send user details to the backend and return the response
const register = async (
  credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
  const response = await axios.post("/user-service/users", credentials);

  return response.data.data;
};

// Registration hook
export const useRegister = () => {
  return useMutation<RegisterResponse, AxiosError, RegisterCredentials>({
    mutationFn: register,
    onSuccess: () => {
      console.log("Registration successful!");
    },
    onError: () => {
      console.error("Registration failed!");
    },
  });
};

const verifyToken = async () => {
  const response = await axios.get(`/user-service/auth/verify-token`);

  return response.data.data;
};

export const useVerifyToken = () => {
  return useQuery<void, AxiosError>({
    queryKey: ["verifyToken"],
    queryFn: () => verifyToken(),
  });
};
