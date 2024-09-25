import axios from "axios";

const API_URL = import.meta.env.VITE_QUESTION_API_URL;

export const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/questions`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
