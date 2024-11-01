import { Question } from "./Question";

export type QuestionHistory = Question & {
  dateAttempted: string;
  codeWritten: string;
};
