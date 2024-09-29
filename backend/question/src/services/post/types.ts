export interface ICreateQuestionPayload {
  title: string;
  description: string;
  difficulty: string;
  topics: number[];
}

export interface IUpdateQuestionPayload extends ICreateQuestionPayload {
  id: number;
}

export interface IDeleteQuestionPayload {
  id: number;
}
