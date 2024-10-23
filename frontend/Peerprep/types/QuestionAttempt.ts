export type QuestionAttempt = {
    sessionId: string;
    dateTime: string;
    matchedUser: string;
    questionId: string;
    questionTitle: string;
    questionDifficulty: string;  // Match this with actual_difficulty
    questionCategory: string;
};