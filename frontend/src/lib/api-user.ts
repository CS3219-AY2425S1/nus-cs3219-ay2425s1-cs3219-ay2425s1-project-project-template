import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_USER_API_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};

export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};

export const updateUser = async (userId: string, token: string, data: { username: string, email: string }) => {
  try {
    const response = await axios.patch(`${BASE_URL}/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    })
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
}

export const updatePassword = async (userId: string, token: string, password: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/users/${userId}`, {
        "password": password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};
