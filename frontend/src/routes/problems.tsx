import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: number;
  title: string;
  categories: string[];
  complexity: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

const questions: Question[] = [
  {
    id: 1,
    title: 'Two Sum',
    categories: ['Array', 'Hash Table'],
    complexity: 'Easy',
    description: 'Find two numbers that add up to a target value.',
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    categories: ['Linked List', 'Math'],
    complexity: 'Medium',
    description: 'Add two numbers represented by linked lists.',
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    categories: ['Hash Table', 'Two Pointers', 'String'],
    complexity: 'Medium',
    description: 'Find the longest substring without repeating characters.',
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    categories: ['Array', 'Binary Search', 'Divide and Conquer'],
    complexity: 'Hard',
    description: 'Find the median of two sorted arrays.',
  },
  {
    id: 5,
    title: 'Longest Palindromic Substring',
    categories: ['String', 'Dynamic Programming'],
    complexity: 'Medium',
    description: 'Find the longest palindromic substring.',
  },
  {
    id: 6,
    title: 'ZigZag Conversion',
    categories: ['String'],
    complexity: 'Medium',
    description: 'Convert a string to zigzag pattern on a given number of rows.',
  },
  {
    id: 7,
    title: 'Reverse Integer',
    categories: ['Math'],
    complexity: 'Easy',
    description: 'Reverse digits of an integer.',
  },
  {
    id: 8,
    title: 'String to Integer (atoi)',
    categories: ['Math', 'String'],
    complexity: 'Medium',
    description: 'Convert a string to an integer.',
  },
  {
    id: 9,
    title: 'Palindrome Number',
    categories: ['Math'],
    complexity: 'Easy',
    description: 'Determine whether an integer is a palindrome.',
  },
  {
    id: 10,
    title: 'Regular Expression Matching',
    categories: ['String', 'Dynamic Programming', 'Backtracking'],
    complexity: 'Hard',
    description: 'Implement regular expression matching with support for \'.\' and \'*\'.',
  },
];

const getComplexityColor = (complexity: 'Easy' | 'Medium' | 'Hard') => {
  switch (complexity) {
    case 'Easy':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Hard':
      return 'bg-red-100 text-red-800 border-red-300';
  }
};

export default function ProblemsRoute() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Problem Set</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead className="w-[30%]">Categories</TableHead>
            <TableHead>Complexity</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question: Question) => (
            <TableRow key={question.id}>
              <TableCell className="font-medium">
                <Link to={`/problems/${question.id}`} className="text-blue-600 hover:underline">
                  {question.title}
                </Link>
              </TableCell>
              <TableCell>
                {question.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="mr-1">
                    {category}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={`${getComplexityColor(question.complexity)} font-medium`}
                >
                  {question.complexity}
                </Badge>
              </TableCell>
              <TableCell>{question.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
