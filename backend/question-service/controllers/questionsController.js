const QuestionSchema = require('../models/Question');


const getAllQuestions = async (req, res) => {
    const questions = await QuestionSchema.find();
    if (!questions) return res.status(204).json({ 'message': 'No questions found.' });
    res.json(questions);
}

const createQuestion = async (req, res) => {
    if (!(req?.body?.title && req?.body?.description && req?.body?.category && req?.body?.complexity)) {
        return res.status(400).json({ 'message': 'title, description, category and complexity are required!' });
    }    
    try {
        const result = await QuestionSchema.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            complexity: req.body.complexity
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id; // Get ID from URL parameters
    console.log('Received questionId:', questionId); // Log the questionId

    if (!questionId) {
        return res.status(400).json({ 'message': 'Question ID is required.' });
    }

    const question = await QuestionSchema.findOne({ _id: questionId }).exec();
    console.log('question:', question); // Log the questionId

    if (!question) {
        return res.status(401).json({ "message": `No question matches ID ${ questionId}.` });
    }

    if (req.body?.title) question.title = req.body.title;
    if (req.body?.description) question.description = req.body.description;
    if (req.body?.category) question.category = req.body.category;
    if (req.body?.complexity) question.complexity = req.body.complexity;

    const updatedQuestion = await question.save();
    return res.status(200).json(updatedQuestion); // Ensure you return the updated question as JSON
  } catch (error) {
      console.error('Error updating question:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteQuestion = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Question ID is required.' });

    const question = await QuestionSchema.findOne({ _id: req.body.id }).exec();
    if (!question) {
        return res.status(204).json({ "message": `No question matches ID ${req.body.id}.` });
    }
    const result = await question.deleteOne();
    res.json(result);
}

const getQuestion = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Question ID required.' });

    const question = await QuestionSchema.findOne({ _id: req.params.id }).exec();
    if (!question) {
        return res.status(204).json({ "message": `No question matches ID ${req.params.id}.` });
    }
    res.json(question);
}


module.exports = {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion
}