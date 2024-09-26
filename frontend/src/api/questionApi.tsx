import axios from "axios";

const API_URL = import.meta.env.VITE_QUESTION_API_URL;

export const getAllQuestions = async ({
  page,
  limit,
  sort,
  order,
  search,
}: {
  page: number;
  limit: number;
  sort: string;
  order: string;
  search?: string;
}) => {
  try {
    let url = `${API_URL}/api/questions?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axios.get(url);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};