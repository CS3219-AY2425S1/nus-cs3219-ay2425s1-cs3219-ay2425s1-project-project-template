import { check, body } from 'express-validator';

export const createQuestionValidators = [
    check('title').isString().isLength({ min: 1 }),
    check('description').isString().isLength({ min: 1 }),
    check('category').isString().isLength({ min: 1 }),
    check('complexity').isString().isLength({ min: 1 }),
];

export const idValidators = [
    check('id').isInt(),
];

export const updateQuestionValidators = [
    check('id').isInt(),
    body().custom((body) => {
        const { title, description, category, complexity } = body;
        if (!title && !description && !category && !complexity) {
            throw new Error('At least one field must be provided');
        }
    })
];