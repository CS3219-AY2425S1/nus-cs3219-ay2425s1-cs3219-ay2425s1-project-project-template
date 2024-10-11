import { Schema } from 'mongoose'
import { Category, Complexity } from '@repo/user-types'

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
    category: {
        type: String,
        enum: Object.values(Category),
        required: true,
    },
    complexity: {
        type: String,
        enum: Object.values(Complexity),
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
