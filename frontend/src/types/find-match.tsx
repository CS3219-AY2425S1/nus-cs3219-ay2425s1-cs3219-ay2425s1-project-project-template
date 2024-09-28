export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum QuestionLanguages {
  PYTHON = "python",
  JAVASCRIPT = "javascript",
}

export enum QuestionTopics {
  GRAPHS = "graphs",
  TREES = "trees",
}

export interface QuestionMinified {
  questionId: string;
  questionTitle: string;
  questionDifficulty: string;
}
