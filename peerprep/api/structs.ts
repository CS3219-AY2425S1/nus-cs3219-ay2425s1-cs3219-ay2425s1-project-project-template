export enum Difficulty {
  Easy = 1,
  Medium,
  Hard
}

export interface Question {
  id: number;
  difficulty: Difficulty;
  title: string;
  description: string;
  test_cases: {
    [key: string]: string;
  };
}

export interface ErrorBody {
  error: string;
  status: number;
}

export function isError(obj: Question | ErrorBody): obj is ErrorBody {
  return (obj as ErrorBody).error !== undefined;
}
