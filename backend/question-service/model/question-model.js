import mongoose from "mongoose";

const QuestionModelSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        complexity: {
            type: String,
            required: true
        }
    }
);

export default mongoose.model("QuestionModel", QuestionModelSchema);