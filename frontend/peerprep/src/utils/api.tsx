import axios, { AxiosInstance } from "axios"
import React from "react"


export const initApi = (setAuth: React.Dispatch<React.SetStateAction<boolean>>) : AxiosInstance => {
 // initialise axios with setAuth in middleware
  const api = axios.create({
    baseURL: "http://localhost:8080/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // set api middleware
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });

  api.interceptors.response.use((response) => {
    return response;
  }, 
  (error) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response.status === 401 && refreshToken != null) {
      // handle refresh api call
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAuth(false);

    // Navigate to login page

    return Promise.reject(error);
  });

  return api
}