import { initApi } from "../../utils/api.tsx"; // Adjust the import path as needed
import React from "react";

export type Question = {
  id: number;
  title: string;
  description: string;
  categories: string;
  complexity: string;
  link: string;
};

export const questionService = {
  getQuestions: async (setAuth: React.Dispatch<React.SetStateAction<boolean>>): Promise<Question[]> => {
    const api = initApi(setAuth); // Initialize the Axios instance with setAuth
    try {
      const response = await api.get("/questions"); // Use the Axios instance to make the GET request
      return response.data; // Return the data from the response
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      return []; // Return an empty array on error
    }
  },
};
