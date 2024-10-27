interface Problem {
  _id: number;
  title: string;
  difficulty: number;
  description: string;
  examples: string[];
  constraints: string;
  tags: string[];
  title_slug: string;
  pictures?: File[];
}

interface ProblemDialogData {
  _id: number;
  title: string;
  difficulty: number;
  description: string;
}

interface ProblemRequestData {
  title: string;
  difficulty: number;
  description: string;
  examples: string[];
  constraints: string;
  tags: string[];
}

interface FilterBadgeProps {
  filterType: 'Difficulty' | 'Status' | 'Topics';
  value: string;
  onRemove: (filterType: string, value: string) => void;
}

interface FilterSelectProps {
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value: string | string[];
  isMulti?: boolean;
}

// Add a type for user info
interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  username: string;
}

interface UserMatchingRequest {
  _id: string;
  name?: string;
  difficulty?: string;
  topic?: string;
  type: string;
}

interface UserMatchingResponse {
  status: string;
  match: UserMatchingRequest;
}

export type {
  Problem,
  ProblemDialogData,
  ProblemRequestData,
  FilterBadgeProps,
  FilterSelectProps,
  User,
  UserMatchingResponse,
  UserMatchingRequest,
};
