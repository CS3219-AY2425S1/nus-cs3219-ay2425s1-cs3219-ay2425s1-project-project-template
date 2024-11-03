import { Question } from '../types/QuestionType';
import { api } from './ApiClient';

export const getQuestionById = async (
  questionId: String,
): Promise<Question[]> => {
  return api.get(`/questions/id/${questionId}`);
};
