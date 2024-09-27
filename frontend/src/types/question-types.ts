import { Question } from '../routes/questions/logic';

export type IGetQuestionsResponse = {
  questions: Array<Question>;
  totalQuestions: number;
};
