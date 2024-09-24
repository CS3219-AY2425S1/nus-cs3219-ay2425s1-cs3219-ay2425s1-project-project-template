import { useState, useEffect } from "react";
import { Question } from "../types";

const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Commenting out the fetch call
        // const response = await fetch("http://localhost:3001/api/questions");
        // if (!response.ok) {
        //   throw new Error("Failed to fetch questions");
        // }
        // const data = await response.json();
        // setQuestions(data);

        // Using mock data directly
        const mockData: Question[] = [
          {
            id: 1,
            title: "Mock Question 1",
            difficulty: "Easy",
            category: "General",
            description: "This is a mock question description.",
          },
          {
            id: 2,
            title: "Mock Question 2",
            difficulty: "Medium",
            category: "Science",
            description: "This is another mock question description.",
          },
        ];
        setQuestions(mockData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};

export default useQuestions;
