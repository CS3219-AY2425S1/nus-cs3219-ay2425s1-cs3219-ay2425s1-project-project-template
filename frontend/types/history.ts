import { Question } from "./questions";

export interface History {
  room_id: string,
  userOne: string,
  userTwo: string,
  code: string,
  question: Question,
}

export interface HistoryList {
  questions: History[];
  totalPages: string;
}
