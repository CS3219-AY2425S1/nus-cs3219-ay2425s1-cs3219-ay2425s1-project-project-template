// fake data


export interface Question {
    id: string;
    title: string;
    description: string;
    complexity: string;
    categories: string[];
  }
  
export const fakeData: Question[] = [
    { id: '1', title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        complexity: 'Easy',
        categories: ['Array', 'Hash Table'] },
    { id: '2', title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
        complexity: 'Medium',
        categories: ['Linked List', 'Math', 'Recursion'] },
    { id: '3', title: 'Reverse Integer',
        description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.',
        complexity: 'Medium',
        categories: ['Math'] },
    { id: '4', title: 'Palindrome Number',
        description: 'Given an integer x, return true if x is a palindrome and false otherwise.',
        complexity: 'Easy',
        categories: ['Math'] },
    { id: '5', title: 'Regular Expression Matching',
        description: 'Given an input string s and a pattern p, implement regular expression matching with support for . and * where: . Matches any single character. * Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).',
        complexity: 'Hard',
        categories: ['String', 'Recursion', 'Dynamic Programming'] }
];

export const problemComplexity = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
]