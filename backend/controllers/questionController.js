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