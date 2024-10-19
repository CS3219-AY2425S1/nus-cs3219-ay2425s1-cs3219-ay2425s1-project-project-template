import { QuestionComplexity } from "./Question";
import { QuestionTopic } from "./Question";

export type MatchRequest = {
  userId: string;
  topic: QuestionTopic;
  difficulty: QuestionComplexity;
  timestamp: number;
};

export type MatchResponse = {
  message: string;
  error?: string;
};

export type MatchStatus = "PENDING" | "MATCHED" | "CANCELLED" | "NONE";

//TODO: request to standarise the responses to be sent by the backend

export type CheckMatchResponse = {
  status: MatchStatus;
  matchedWithUserId: string;
  topic: string; //TODO: Change to QuestionTopic and QuestionComplexity from backend
};

export type CheckMatchResponseError = {
  status: "NONE";
  message: string;
};
