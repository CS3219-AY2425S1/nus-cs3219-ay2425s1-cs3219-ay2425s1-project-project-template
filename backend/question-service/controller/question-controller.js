import {
    createQuestion as _createQuestion,
    checkDuplicateQuestion as _checkDuplicateQuestion,
    deleteQuestionById as _deleteQuestionById,
    findAllQuestions as _findAllQuestions,
    findQuestionById as _findQuestionById,
    findQuestionByComplexity as _findQuestionByComplexity,
    updateQuestionById as _updateQuestionById,
} from "../model/repository.js";

// Function for creating a question
export async function createQuestion(req, res) {
    try {
        const {id, title, description, category, complexity} = req.body;
        if (id && title && description && category && complexity) {
            // Check duplicates
            const questionExists = await _checkDuplicateQuestion(title, description);
            if (questionExists) {
                return res.status(409).json({ message: "Question already exists"});
            }
            
            const questionCreated = await _createQuestion(id, title, description, category, complexity);
            return res.status(201).json(questionCreated);
        } else {
            return res.status(400).json({ message: "All fields are required"});
        }
    } catch (error) {
        return res.status(500).json({ message: "Not working: " + error.message});
    }
};

export async function findAllQuestions(req, res) {
    try {
        const questions = await _findAllQuestions();
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

export async function findQuestionById(req, res) {
    try {
        const { id } = req.params;
        const question = await _findQuestionById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found"});
        }
        return res.status(200).json(question);
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

export async function findQuestionByComplexity(req, res) {
    try {
        const { complexity } = req.params;
        const question = await _findQuestionByComplexity(complexity);
        if (!question) {
            return res.status(404).json({ message: "Question not found"});
        }
        return res.status(200).json(question);
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

export async function updateQuestionById(req, res) {
    try {
        const { id } = req.params;
        const questionExists = await _findQuestionById(id);
        if (!questionExists) {
            return res.status(404).json({ message: "Question not found"});
        }
        const { title, description, category, complexity } = req.body;
        const question = await _updateQuestionById(id, title, description, category, complexity);
        return res.status(200).json(question);
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

export async function deleteQuestionById(req, res) {
    try {
        const { id } = req.params;
        await _deleteQuestionById(id);
        return res.status(200).json({ message: "Question deleted successfully"});
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}