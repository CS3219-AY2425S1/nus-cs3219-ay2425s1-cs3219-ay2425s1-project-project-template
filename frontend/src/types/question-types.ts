import { Question } from '../routes/question/logic';

export type IGetQuestionsResponse = {
  questions: Array<Question>;
  totalQuestions: number;
};
