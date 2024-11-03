import { Question } from "./questions";

export interface History {
  room_id: string,
  userOne: string,
  userTwo: string,
  code: string,
  question: Question,
}

export interface HistoryList {
  sessions: History[];
  totalPages: string;
  currentPage: string;
  totalSessions: string;
}
