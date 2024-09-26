// import { questionApiClient } from "./api-clients"
import { questions } from '@/assets/questions';

type Question = (typeof questions)[number];

export const getQuestionDetails = (questionId: number): Promise<Question> => {
  // return questionApiClient.get
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(questions.find(({ id }) => id === questionId)!), 1000);
  });
};
