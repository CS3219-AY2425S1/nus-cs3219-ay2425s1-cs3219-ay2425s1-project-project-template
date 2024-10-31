
export interface Question {
    _id: string;
    title: string;
    description: string;
    category: string[];
    complexity: DifficultyLevel; // Changed from string to DifficultyLevel
  }

export interface Attempt {
  questionId: Question;
  peerUserName?: string;
  // Add other relevant fields if necessary, e.g., timestamp, status, etc.
}

export interface FetchAttemptsResponse {
  attempts: Attempt[];
}

export interface CreateAttemptResponse {
  success: boolean;
  message: string;
  // Add other relevant fields based on your API response
}

export interface Counts {
  Easy: number;
  Medium: number;
  Hard: number;
}


export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
