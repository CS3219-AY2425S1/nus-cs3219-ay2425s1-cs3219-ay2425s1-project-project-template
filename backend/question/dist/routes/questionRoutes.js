"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Question_1 = __importDefault(require("../models/Question"));
/**
 * Router for the question service.
 */
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('Hello from question service!');
});
// Create a new question
router.post('/create', [
    (0, express_validator_1.check)('title').isString().isLength({ min: 1 }),
    (0, express_validator_1.check)('description').isString().isLength({ min: 1 }),
    (0, express_validator_1.check)('category').isString().isLength({ min: 1 }),
    (0, express_validator_1.check)('complexity').isString().isLength({ min: 1 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, category, complexity } = req.body;
        const question = { title, description, category, complexity };
        const newQuestion = new Question_1.default(question);
        yield newQuestion.save();
        res.status(200).json({ message: 'Question created succesfully', question: newQuestion });
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
}));
// Retrieve a specific question by id
router.get('/:id', [
    (0, express_validator_1.check)('id').isNumeric(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const questionId = parseInt(req.params.id, 10);
    try {
        const question = yield Question_1.default
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
}));
// Update a specific question by id
router.post('/:id/update', [
    (0, express_validator_1.check)('id').isNumeric(),
    (0, express_validator_1.body)().custom((body) => {
        const { title, description, category, complexity } = body;
        if (!title && !description && !category && !complexity) {
            throw new Error('At least one field must be provided');
        }
    })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const questionId = parseInt(req.params.id);
    const { title, description, category, complexity } = req.body;
    try {
        //try to find question by questionId
        const question = yield Question_1.default
            .findOne({ questionid: questionId })
            .exec();
        if (!question) {
            return res.status(404).send('Question not found');
        }
        else {
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
            yield question.save();
        }
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
}));
// Delete a specific question by id
router.post('/:id/delete', [
    (0, express_validator_1.check)('id').isNumeric(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const questionId = parseInt(req.params.id);
    try {
        const deletedQuestion = yield Question_1.default
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
}));
exports.default = router;
