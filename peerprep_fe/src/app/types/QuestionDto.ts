enum DifficultyLevel {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
  }

interface QuestionDto {
    id: string;
    title: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    topic: string[];
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    constraints: string[];
    createdAt: Date;
    updatedAt: Date;
}