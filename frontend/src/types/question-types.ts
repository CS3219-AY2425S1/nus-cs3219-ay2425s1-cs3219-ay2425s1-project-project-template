export type Question = {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: Array<string>;
  attempted: boolean;
};

export type IGetQuestionsResponse = {
  questions: Array<Question>;
  totalQuestions: number;
};
