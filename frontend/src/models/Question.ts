export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum Topic {
  Array = "Array",
  Strings = "Strings",
  LinkedLists = "Linked Lists",
  Stacks = "Stacks",
  Queues = "Queues",
  Hashing = "Hashing",
  Trees = "Trees",
  Heaps = "Heaps",
  Graphs = "Graphs",
  DynamicProgramming = "Dynamic Programming",
  DataStructures = "Data Structures",
  Recursion = "Recursion",
  Greedy = "Greedy",
  BitManipulation = "Bit Manipulation",
  Math = "Math",
  Algorithms = "Algorithms",
  DataBases = "Databases",
}

export type QuestionExample = {
  input: string;
  output: string;
};

export const topicArray = Object.keys(Topic).map((key) => ({
  value: Topic[key as keyof typeof Topic],
  label: Topic[key as keyof typeof Topic],
}));

export const difficultyArray = Object.keys(Difficulty).map((key) => ({
  value: Difficulty[key as keyof typeof Difficulty],
  label: Difficulty[key as keyof typeof Difficulty],
}));

export type Question = {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  difficulty: Difficulty;
  dateCreated: string;
  examples: QuestionExample[];
  constraints: string[];
};
