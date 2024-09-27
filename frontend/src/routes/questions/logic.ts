import { IGetQuestionsResponse } from '../../types/question-types';
import { dummyData } from '@/assets/dummyData';

export type Question = {
  number: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: Array<string>;
  attempted: boolean;
};

export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
export const ROWS_PER_PAGE = 12;

export async function fetchQuestions(): Promise<IGetQuestionsResponse> {
  return {
    questions: dummyData,
    totalQuestions: 20,
  };
}
