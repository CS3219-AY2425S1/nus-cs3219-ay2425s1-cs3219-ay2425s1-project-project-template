export interface Question {
  id: number;
  title: string;
  description: string;
  category: string[];
  difficulty: Difficulty;
  test_cases: {
    [key: string]: string;
  };
}

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export const categories = [
  "all",
  "Array",
  "Linked List",
  "String",
  "Dynamic Programming",
  "Tree",
] as string[];
