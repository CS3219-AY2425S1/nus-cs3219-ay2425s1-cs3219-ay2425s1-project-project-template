import { createAxiosInstance } from "./Api";

const questionServiceBaseURL = import.meta.env.VITE_QUESTION_SERVICE_BASEURL;

const questionApi = createAxiosInstance(questionServiceBaseURL);

export const getQuestions = async () => {
  const response = await questionApi.get("/question");
  if (response.status !== 200) {
    throw new Error("Error fetching questions");
  } else {
    return response.data;
  }
};

export const deleteQuestion = async (id) => {
  const response = await questionApi.delete(`/question/${id}`);
  if (response.status !== 200) {
    throw new Error("Error deleting question");
  } else {
    return response.data;
  }
};

export const updateQuestion = async (id, question) => {
  const response = await questionApi.put(`/question/${id}`, question);
  if (response.status !== 200) {
    throw new Error("Error updating question");
  } else {
    return response.data;
  }
};

export const createQuestion = async (question) => {
  const response = await questionApi.post("/question", question);
  if (response.status !== 201) {
    throw new Error("Error creating question");
  } else {
    return response.data;
  }
};
