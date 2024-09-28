import { CreateQuestionDto, QuestionDto } from "@repo/dtos/questions";
import { apiCall } from "@/lib/api/apiClient";

export const fetchQuestions = async (): Promise<QuestionDto[]> => {
  return await apiCall("get", "/questions");
};

export const createQuestion = async (
  createQuestionDto: CreateQuestionDto,
): Promise<QuestionDto> => {
  return await apiCall("post", "/questions", createQuestionDto);
};
