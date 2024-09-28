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
  difficulty?: string[],
  title?: string
): Promise<QuestionListResponse> => {
  let query_url = `${process.env.NEXT_PUBLIC_API_URL}questions`;
  let query_params = "";

  if (currentPage) {
    query_params += `?offset=${(currentPage - 1) * 10}`;
  }

  if (limit) {
    query_params += `${query_params.length > 0 ? "&" : "?"}limit=${limit}`;
  }

  if (sortBy) {
    const [field, order] = sortBy.split(" ");
    query_params += `${
      query_params.length > 0 ? "&" : "?"
    }sortField=${field}&sortValue=${order}`;
  }

  if (difficulty && difficulty.length > 0) {
    const value = difficulty.join(","); // Change them from ["easy", "medium"] to "easy,medium"
    query_params += `${query_params.length > 0 ? "&" : "?"}complexity=${value}`;
  }

  if (title && title != "") {
    const urlEncodedTitle = encodeURIComponent(title);
    query_params += `${
      query_params.length > 0 ? "&" : "?"
    }title=${urlEncodedTitle}`;
  }

  // TODO: (Ryan) Filtering via categories

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
export async function DeleteQuestion(docRef: String): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}questions/${docRef}`, {
    method: "DELETE"
  }) 
  // error handling later 
  // if (!res.ok) {
  //   throw new Error(`Delete request responded with ${res.status}: ${res.body}`)
  // }
}
