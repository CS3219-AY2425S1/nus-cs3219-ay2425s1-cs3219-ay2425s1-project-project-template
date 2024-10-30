export interface Question {
  questionId: number;
  title: string;
  difficulty: Difficulty;
  category: string[];
  description: string;
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}
