import {
    createQuestion as _createQuestion,
    deleteQuestionById as _deleteQuestionById,
    findAllQuestions as _findAllQuestions,
    findQuestionById as _findQuestionById,
    findQuestionByTitleAndComplexity as _findQuestionByTitleAndComplexity,
    updateQuestionById as _updateQuestionById,
    deleteQuestionById as _deleteQuestionById,
} from "../model/repository.js";

// Function for creating a question
export async function createQuestion(req, res) {
    try {
        const {id, title, description, category, complexity} = req.body;
        if (id && title && description && category &&complexity) {
            // Check duplicates
            const questionExists = await _findQuestionById(id);
            if (questionExists) {
                return res.status(409).json({ message: "Question already exists"});
            }
            
            const questionCreated = await _createQuestion(id, title, description, category, complexity);
            return res.status(201).json(questionCreated);
        } else {
            return res.status(400).json({ message: "All fields are required"});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}