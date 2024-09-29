import { createAxiosInstance } from "./Api";

const questionServiceBaseURL = import.meta.env.VITE_QUESTION_SERVICE_BASEURL;

const questionApi = createAxiosInstance(questionServiceBaseURL);

export const getQuestions = async () => {
  const response = await questionApi.get("/question");
  return response.data;
};
