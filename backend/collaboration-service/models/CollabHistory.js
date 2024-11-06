const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
    question_id: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    partner_username: {
        type: String,
        required: true
    },
});

const collabHistorySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    attempts: [attemptSchema]
})

const CollabHistory = mongoose.model("CollabHistory", collabHistorySchema);
module.exports = CollabHistory;
