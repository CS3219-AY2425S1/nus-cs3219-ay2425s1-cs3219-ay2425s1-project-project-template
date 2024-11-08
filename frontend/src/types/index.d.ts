declare type Difficulty = "easy" | "medium" | "hard";

declare interface QuestionProps {
    question: {
        questionId: number;
        title: string;
        description?: string;
        categories: string[];
        difficulty: Difficulty;
    };
}

declare interface PastMatch {
    matchId: string;
    questionId: string;
    attempts: string[];
    collaborators: string[];
    createdAt: string;
    updatedAt: string;
}

declare interface Submission {
    matchId: string;
    questionId: number;
    language: string;
    code: string;
    solved: boolean;
    testCasesPassed: number;
    testCasesTotal: number;
    createdAt: string;
    updatedAt: string;
}