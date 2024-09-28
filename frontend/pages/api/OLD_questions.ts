import { Question } from '@/types/questions';



export const DUMMY_DATA: Question[] = [
    {
        questionId: 0,
        title: "reverse a string",
        description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory. \n\n**Example 1:**\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\n**Example 2:**\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\n**Constraints:**\n1 <= s.length <= 105\ns[i] is a printable ascii character.",
        category: "Strings, Algorithms",
        complexity: 'easy'
    },
    {
        questionId: 1,
        title: "Linked List cycle detection",
        description: "Implement a function to detect if a linked list contains a cycle.",
        category: "data structures, algorithms",
        complexity: 'easy',
    }
];

