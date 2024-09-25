export interface Question {
  id: string;
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

// GET request to fetch all the questions (TODO: Ben --> Fetch with filtering/sorting etc)
export const GetQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}questions`);
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
