export * from './utility';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MatchRequest {
    userId: string;
    topic: string;
    difficulty: Difficulty;
    timestamp: number;
  }
