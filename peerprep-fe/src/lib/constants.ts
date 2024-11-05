import { Problem } from '@/types/types';

export const DIFFICULTY_OPTIONS = [
  { value: '1', label: 'Easy' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'Hard' },
];

export const STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'solved', label: 'Solved' },
];

export const INITIAL_PROBLEM_DATA: Problem = {
  _id: Math.floor(Math.random() * 10000), // Generate a temporary ID for new problems
  title: '',
  difficulty: 1, // Set a default difficulty
  description: '',
  examples: [],
  constraints: '',
  tags: [],
  title_slug: '',
};

export const SUPPORTED_PROGRAMMING_LANGUAGES = ['Python', 'Java', 'C++'];

export const DEFAULT_CODE = `int main() {
    "Hello World!";
    return 0;
}`;

export const PASSWORD_RULES = {
  minLength: 8,
};

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
