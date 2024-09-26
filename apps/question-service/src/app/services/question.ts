import { stringify } from 'querystring'

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
  limit?: number,
  sortBy?: string,
  difficulties?: string[],
  categories?: string[],
  title?: string
): Promise<QuestionListResponse> => {
  let query_url = `${process.env.NEXT_PUBLIC_API_URL}questions`;
  const params: NodeJS.Dict<number | string | string[]> = {}

  if (currentPage) {
    params.offset = (currentPage - 1) * 10;
  }

  if (limit) {
    params.limit = limit;
  }

  if (sortBy) {
    const [field, order] = sortBy.split(" ");
    params.sortField = field;
    params.sortValue = order;
  }

  if (difficulties && difficulties.length > 0) {
    params.complexity = difficulties;
  }
  
  if (title && title != "") {
    const urlEncodedTitle = encodeURIComponent(title);
    params.title = urlEncodedTitle
  }
  
  // TODO: (Ryan) Filtering via categories
  if (categories && categories.length > 0) {
    params.categories = categories;
  }

  const response = await fetch(`${query_url}?${stringify(params)}`);
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
