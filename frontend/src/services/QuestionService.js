import { createAxiosInstance } from "./Api";

const baseURL = process.env.QUESTION_SERVICE_BASEURL;

const questionApi = createAxiosInstance(baseURL);

export const getQuestions = async () => {
  const response = await questionApi.get("/questions");
  return response.data;
};
