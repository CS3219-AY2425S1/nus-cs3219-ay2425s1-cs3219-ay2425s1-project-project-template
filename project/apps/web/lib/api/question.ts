import {
  CreateQuestionDto,
  QuestionDto,
  UpdateQuestionDto,
} from "@repo/dtos/questions";
import { apiCall } from "@/lib/api/apiClient";

export const fetchQuestions = async (): Promise<QuestionDto[]> => {
  try {
    return await apiCall("get", "/questions");
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const createQuestion = async (
  createQuestionDto: CreateQuestionDto,
): Promise<QuestionDto> => {
  try {
    return await apiCall("post", "/questions", createQuestionDto);
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const updateQuestion = async (
  updateQuestionDto: UpdateQuestionDto,
): Promise<QuestionDto> => {
  try {
    return await apiCall(
      "put",
      `/questions/${updateQuestionDto.id}`,
      updateQuestionDto,
    );
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    return await apiCall("delete", `/questions/${id}`);
  } catch (error) {
    console.error(`Error deleting question with ID ${id}:`, error);
    throw error;
  }
};
