// Requests to API endpoints for questions
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axios";
import { Question } from "@/types/questions";

// Fetch questions list
export const useQuestions = () => {
  return useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: async (): Promise<Question[]> => {
      const response = await axios.get("/questions");
      return response.data;
    },
  });
};

// Fetch a single question
export const useGetQuestion = (id: string) => {
  return useQuery<Question, Error>({
    queryKey: ["question", id],
    queryFn: async () => {
      const response = await axios.get(`/questions/${id}`);
      return response.data;
    },
    enabled: !!id, // Only fetch if id is available
  });
};

// Add a new questions
export const useAddQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation<Question, Error, Question>({
    mutationFn: async (question: Question) => {
      return axios.post("/questions", question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

// Update a question
export const useUpdateQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation<Question, Error, Question>({
    mutationFn: async (question: Question) => {
      return axios.put(`/questions/${question.questionId}`, question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

// Delete a question
export const useDeleteQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (questionId: string) => {
      return axios.delete(`/questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};
