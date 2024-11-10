const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
    },
    text: {
        type: String,
    },
    language: {
        type: String,
        required: true
    },
    partner_username: {
        type: String,
        required: true
    },
    question: {
        type: String
    }
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
