const Question = require('../models/questionModel')

// returns every question in the database 
exports.getQuestions = async (req, res, next) => {
    try {
        let questions = await Question.find({})
        res.status(200).json(questions)

    } catch (err) {
        console.log(err)
    }
}

// adds new question
exports.addQuestion = async (req, res, next) => {
    const { title, description, category, complexity } = req.body;
    if (!title || !description || !category || !complexity) {
        return res.status(400).json({ message: 'Please enter all fields.'})
    }

    try {
        const newQuestion = await Question.create({
            title, 
            description, 
            category, 
            complexity
        })

        res.status(201).json({
            _id: newQuestion._id,
            title: newQuestion.title,
            description: newQuestion.description,
            category: newQuestion.category,
            complexity: newQuestion.complexity
        })
    } catch(error) {
        return res.status(400).json({ message: 'Invalid question data.' })
    }
}
