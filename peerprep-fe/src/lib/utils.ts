import { clsx, type ClassValue } from 'clsx';

import { twMerge } from 'tailwind-merge';
import { EMAIL_REGEX, PASSWORD_RULES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function getDifficultyString(difficulty: number) {
  switch (difficulty) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Hard';
    default:
      return 'Unknown';
  }
}

export const validatePassword = (
  password: string,
  confirmPassword?: string,
): string[] => {
  const errors: string[] = [];

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_RULES.minLength} characters long`,
    );
  }
  // Add more password validation rules here if needed

  if (confirmPassword && password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
};

export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return errors;
};

export const validateUsername = (username: string): string[] => {
  const errors: string[] = [];
  if (!username.trim()) {
    errors.push('Username is required');
  }
  return errors;
};

export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.abs(hash).toString(16).substring(0, 6);
  return `#${'0'.repeat(6 - color.length)}${color}`;
};
