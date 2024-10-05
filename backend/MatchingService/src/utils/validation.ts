import { MatchRequest, DifficultyLevel, Category } from './types';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const validateMatchRequest = (request: MatchRequest): void => {
    if (!request.difficultyLevel || !request.category) {
        throw new ValidationError('Missing required fields');
    }

    if (!Object.values(DifficultyLevel).includes(request.difficultyLevel)) {
        throw new ValidationError('Invalid question difficulty level');
    }

    if (!Object.values(Category).includes(request.category)) {
        throw new ValidationError('Invalid question category');
    }
};