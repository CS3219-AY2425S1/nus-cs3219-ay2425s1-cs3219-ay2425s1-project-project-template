import axios from "axios";

const API_URL = import.meta.env.VITE_MATCHING_API_URL;

export const findMatch = async (
    userId: number,
    topic: string,
    difficulty: string
  ) => {
    const payload = {
      userId: userId,
      topic: topic,
      difficulty: difficulty,
    };
    try {
      const response = await axios.post(`${API_URL}/api/match`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error finding match:", error);
      throw error;
    }
};