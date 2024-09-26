export interface Question {
  id: number;
  docRefId: string;
  title: string;
  description?: string;
  categories: string[]; // enum[]
  complexity: string; // enum
  assets?: string[];
  createdAt?: Date; // or string
  updatedAt?: Date; // or string
  deletedAt?: Date;
  testCases?: string[];
}

export interface QuestionListResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  questions: Question[];
}

// GET request to fetch all the questions (TODO: Ben --> Fetch with filtering/sorting etc)
export const GetQuestions = async (
  currentPage?: number,
  limit?: number
): Promise<QuestionListResponse> => {
  let query_url = `${process.env.NEXT_PUBLIC_API_URL}questions`;
  let query_params = "";

  if (currentPage) {
    query_params += `?currentPage=${currentPage}`;
  }

  if (limit) {
    query_params += `${query_params.length > 0 ? "&" : "?"}limit=${limit}`;
  }

  query_url += query_params;
  const response = await fetch(query_url);
  const data = await response.json();
  return data;
};

// Get single question
export const GetSingleQuestion = async (docRef: string): Promise<Question> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}questions/${docRef}`
  );
  const data = await response.json();
  return data;
};

// Update single question (TODO: Sean)

// Delete single question (TODO: Ryan)
