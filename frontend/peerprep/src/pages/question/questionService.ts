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

// Do not have to recreate API object here
// This is done on the top level in <App/> component => You can think of useContext as a global state where u can retrieve
// the prop when calling useApiContext(). In this case, the state retrieve is the axios instance.
// 
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
