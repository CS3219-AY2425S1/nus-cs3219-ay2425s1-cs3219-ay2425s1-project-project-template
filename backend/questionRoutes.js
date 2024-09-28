const express = require('express');
const Question = require('./models/Question');
const router = new express.Router();

// POST endpoint to create a new question
router.post('/questions', async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.status(201).send(newQuestion);
    } catch (error) {
          res.status(400).send(error);
    }
});

// GET endpoint to retrieve all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find({});
        res.send(questions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET endpoint to retrieve a question by ID
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findOne({ question_id: req.params.id });
        if (!question) {
            return res.status(404).send();
        }
        res.send(question);
    } catch (error) {
        res.status(500).send(error);
    }
});

// PATCH endpoint to update a question by ID
router.patch('/questions/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'category', 'complexity', 'web_link'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) {
            return res.status(404).send();
        }
        res.send(question);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE endpoint to delete a question by ID
router.delete('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).send();
        }
        res.send(question);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;