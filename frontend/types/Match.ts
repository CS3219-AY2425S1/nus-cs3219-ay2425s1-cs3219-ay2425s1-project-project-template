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

export type MatchFoundResponse = {
  matchedWithUserId: string;
  matchedTopic: string;
  matchedRoom: string;
};
