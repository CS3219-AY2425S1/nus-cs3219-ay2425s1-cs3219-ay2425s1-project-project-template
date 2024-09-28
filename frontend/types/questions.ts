export interface Question {
    questionId: number;     // Unique identifier for the question
    title: string;          // Title or main prompt of the question
    description: string;    // Detailed description of the question
    category: string;       // Category or topic to which the question belongs
    complexity: 'easy' | 'medium' | 'hard';     // Complexity level (e.g., easy, medium, hard)
}