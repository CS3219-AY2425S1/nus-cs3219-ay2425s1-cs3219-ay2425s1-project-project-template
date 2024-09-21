export type Question = {
    id: number;
    title: string;
    description: string;
    categories: string;
    complexity: string;
    link: string;
  };

  export const dummyQuestions: Question[] = [
    {
      id: 1,
      title: "Reverse a string",
      description: "Given a string, return it in reverse order.",
      categories: "Strings",
      complexity: "Easy",
      link: "https://example.com/reverse-string",
    },
    {
      id: 2,
      title: "Linked List Cycle Detection",
      description: "Determine if a linked list contains a cycle.",
      categories: "Data Structures",
      complexity: "Easy",
      link: "https://example.com/linked-list-cycle",
    },
    {
      id: 3,
      title: "Roman to Integer",
      description: "Convert a Roman numeral to an integer.",
      categories: "Algorithms",
      complexity: "Easy",
      link: "https://example.com/roman-to-integer",
    },
    {
      id: 4,
      title: "Add Binary",
      description: "Add two binary numbers and return the result as a binary string.",
      categories: "Bit manipulation",
      complexity: "Easy",
      link: "https://example.com/add-binary",
    },
    {
      id: 5,
      title: "Fibonacci Number",
      description: "Return the Nth Fibonacci number using recursion.",
      categories: "Recursion",
      complexity: "Easy",
      link: "https://example.com/fibonacci-number",
    },
  ];
  
  
  export const questionService = {
    getQuestions: async (): Promise<Question[]> => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        // const data: Question[] = await response.json();
        // return data;
        return dummyQuestions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  };
  