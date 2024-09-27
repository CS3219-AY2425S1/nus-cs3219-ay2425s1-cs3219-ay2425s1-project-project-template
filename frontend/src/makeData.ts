// fake data


export interface Question {
    qid: Number;
    title: string;
    description: string;
    complexity: string;
    categories: string[];
  }
  


export const problemComplexity = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
]