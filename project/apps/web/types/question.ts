export enum COMPLEXITY {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface Question {
  id: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  q_title: string;
  q_desc: string;
  q_category: string[];
  q_complexity: COMPLEXITY;
}
