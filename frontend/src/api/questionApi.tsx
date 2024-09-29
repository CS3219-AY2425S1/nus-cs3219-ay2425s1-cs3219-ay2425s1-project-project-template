import axios from "axios";

const API_URL = import.meta.env.VITE_QUESTION_API_URL;

export const getAllQuestions = async ({
  page,
  limit,
  sort,
  order,
}: {
  page: number;
  limit: number;
  sort: string;
  order: string;
}) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/questions?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const fetchQuestionById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};
