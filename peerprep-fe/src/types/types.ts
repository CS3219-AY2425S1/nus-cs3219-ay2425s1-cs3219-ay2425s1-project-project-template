interface Problem {
  question_id: number;
  title: string;
  difficulty: number;
  description: string;
  examples: string[];
  constraints: string;
  tags: string[];
  title_slug: string;
  pictures?: File[];
}

interface ProblemDialogData {
  question_id: number;
  title: string;
  difficulty: number;
  description: string;
}

export type { Problem, ProblemDialogData };
