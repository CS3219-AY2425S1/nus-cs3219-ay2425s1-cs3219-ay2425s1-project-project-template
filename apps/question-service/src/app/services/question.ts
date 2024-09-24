export interface Question {
  id: string;
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

// GET resquest to fetch all the questions
export const GetQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}questions`);
  const data = await response.json();
  return data;
};
