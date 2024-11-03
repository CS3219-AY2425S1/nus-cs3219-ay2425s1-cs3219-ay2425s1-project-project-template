import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    questionId: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    codeSnippet: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("HistoryModel", HistorySchema);