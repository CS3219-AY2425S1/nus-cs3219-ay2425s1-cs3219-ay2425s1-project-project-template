import { UUID } from 'crypto';

export interface Questions {
  _question_id: number;
  difficulty: number; // 1, 2, 3
  description: string;
  examples: string[];
  constraints: string;
  tags: string[];
  title_slug: string;
  title: string;
  pictures?: File[];
}

export interface UserQuestions {
  _user_id: UUID;
  _question_id: UUID;
  status: string; // 'completed', 'in-progress', 'not-started'
}
