import type { IServiceResponse } from '@/types';

//=============================================================================
// /get
//=============================================================================
export type IGetQuestionsPayload = {
  // Filters
  questionName?: string;
  difficulty?: string;
  topic?: Array<string>;
  // Pagination
  pageNum?: number; // Default 0
  recordsPerPage?: number; // Default 20
};

export type IGetQuestionsResponse = IServiceResponse<{
  questions: Array<{
    id: string; // name or title of the question
    title: string; // question's unique identifier or number
    difficulty: string; // difficulty level (e.g., 'easy', 'medium', 'hard')
    topic: Array<string>; // array of topics the question belongs to
    attempted?: boolean; // whether the user has attempted this question
  }>;
  totalQuestions: number; // total number of questions matching the query
}>;

//=============================================================================
// /details
//=============================================================================
export type IGetQuestionPayload = {
  questionNum: number;
};

export type IGetQuestionResponse = IServiceResponse<{
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  question: {
    // TODO: Add schema from db
    /**
     * - name
     * - number
     * - description
     * - difficulty
     * - topic
     * - submissionHistory?: TBC
     */
  };
}>;

//=============================================================================
// /random (For matching)
//=============================================================================
export type IGetRandomQuestionPayload = {
  userId: number;
  difficulty?: string;
  topic?: Array<string>;
};

export type IGetRandomQuestionResponse = IServiceResponse<{
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  question: {
    // TODO: Add schema from db
    /**
     * - name
     * - number
     * - description
     * - difficulty
     * - topic
     * - submissionHistory?: TBC
     */
  };
}>;
