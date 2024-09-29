const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question_id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true
    },
    complexity: {
        type: String,
        required: true
    },
    web_link: {
        type: String,
        required: true
    },
});

const Question = mongoose.model("question", questionSchema);
module.exports = Question;
