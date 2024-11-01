import { Question } from "./Question";

export type QuestionHistory = Question & {
  dateAttempted: string;
  attempt: string;
};
