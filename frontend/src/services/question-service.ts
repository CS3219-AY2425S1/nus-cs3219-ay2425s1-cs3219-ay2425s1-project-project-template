// import { questionApiClient } from "./api-clients"
import { dummyData } from '@/assets/dummyData';
import { questions } from '@/assets/questions';
import { IGetQuestionsResponse } from '@/types/question-types';

type Question = (typeof questions)[number];

export const getQuestionDetails = (questionId: number): Promise<Question> => {
  // return questionApiClient.get
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(questions.find(({ id }) => id === questionId)!), 1000);
  });
};

export const ROWS_PER_PAGE = 8;
export async function fetchQuestions(pageParam: number = 0): Promise<IGetQuestionsResponse> {
  // return questionApiClient.get
  const start = pageParam * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  await new Promise((r) => setTimeout(r, 10));
  return {
    questions: dummyData.slice(start, end),
    totalQuestions: dummyData.length,
  };
}
