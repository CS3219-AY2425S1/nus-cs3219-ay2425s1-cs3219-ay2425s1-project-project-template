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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  questions: Array<{
    // TODO: Add schema from DB
    /**
     * - name
     * - number
     * - difficulty
     * - topic
     * - attempted?: May need joining with users table, or not
     */
  }>;
  isLastPage?: boolean;
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
