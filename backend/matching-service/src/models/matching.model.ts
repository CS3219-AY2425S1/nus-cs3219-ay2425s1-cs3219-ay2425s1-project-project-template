import { Schema } from 'mongoose'

const matchSchema = new Schema({
    user1Id: {
        type: String,
        required: true,
    },
    user2Id: {
        type: String,
        required: true,
    },
    questionId: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
    },
    matchToken: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default matchSchema
