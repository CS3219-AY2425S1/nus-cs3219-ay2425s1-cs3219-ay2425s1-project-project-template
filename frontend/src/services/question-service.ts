// import { questionApiClient } from "./api-clients"
import { questionDetails, questions } from '@/assets/questions';
import { IGetQuestionsResponse } from '@/types/question-types';

type QuestionDetails = (typeof questionDetails)[number];

export const getQuestionDetails = (questionId: number): Promise<QuestionDetails> => {
  // return questionApiClient.get
  console.log(questionDetails.find(({ id }) => id === questionId));
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(questionDetails.find(({ id }) => id === questionId)!), 1000);
  });
};

export const ROWS_PER_PAGE = 8;
export async function fetchQuestions(pageParam: number = 0): Promise<IGetQuestionsResponse> {
  // return questionApiClient.get
  const start = pageParam * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  await new Promise((r) => setTimeout(r, 10));

  return {
    questions: questions.slice(start, end),
    totalQuestions: questions.length,
  };
}
