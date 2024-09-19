import { LoginData } from "../@types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
