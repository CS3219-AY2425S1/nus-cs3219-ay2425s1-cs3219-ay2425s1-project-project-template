import express, { Request, Response } from 'express';
import { check, validationResult, body } from 'express-validator';
import Question from "../models/Question";

/**
 * Router for the question service.
 */

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from question service!');
});

// Create a new question
router.post('/create', [
    check('title').isString().isLength({ min: 1 }),
    check('description').isString().isLength({ min: 1 }),
    check('category').isString().isLength({ min: 1 }),
    check('complexity').isString().isLength({ min: 1 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, category, complexity } = req.body;
        const question = { title, description, category, complexity };
        const newQuestion = new Question(question);
        await newQuestion.save();
        res.status(200).json({ message: 'Question created succesfully', question: newQuestion });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

// Retrieve a specific question by id
router.get('/:id', [
    check('id').isNumeric(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const questionId = parseInt(req.params.id, 10);
    try {
        const question = await Question
            .findOne({ questionid: questionId })
            .exec();
        if (question) {
            res.json(question);
        }
        else {
            res.status(404).send('Question not found');
        }
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});

// Update a specific question by id
router.post('/:id/update', [
    check('id').isNumeric(),
    body().custom((body) => {
        const { title, description, category, complexity } = body;
        if (!title && !description && !category && !complexity) {
            throw new Error('At least one field must be provided');
        }
    })
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const questionId = parseInt(req.params.id);
    const { title, description, category, complexity } = req.body;

    try {
        //try to find question by questionId
        const question = await Question
            .findOne({ questionid: questionId })
            .exec();
        if (!question) {
            return res.status(404).send('Question not found');
        } else {
            //update the fields that are provided, else use the existing values
            if (title) {
                question.title = title;
            }
            if (description) {
                question.description = description;
            }
            if (category) {
                question.category = category;
            }
            if (complexity) {
                question.complexity = complexity;
            }
            await question.save();
        }
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});

// Delete a specific question by id
router.post('/:id/delete', [
    check('id').isNumeric(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const questionId = parseInt(req.params.id);
    try {
        const deletedQuestion = await Question
            .findOneAndDelete({ questionid: questionId })
            .exec();
        if (deletedQuestion) {
            res.json(deletedQuestion);
        }
        else {
            res.status(404).send('Question not found');
        }
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});

export default router;