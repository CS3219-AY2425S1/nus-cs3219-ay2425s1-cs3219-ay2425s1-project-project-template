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
}, 
signal: AbortSignal
) => {
  try {
    let url = `${API_URL}/api/questions?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axios.get(url, {signal});
    console.log(response);
    return response.data;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
    console.error("Error fetching questions:", error);
    throw error;
    }
  }
};