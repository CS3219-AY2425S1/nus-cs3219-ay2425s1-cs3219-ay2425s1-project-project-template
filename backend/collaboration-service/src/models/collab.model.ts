import { Schema } from 'mongoose'
import { CollabDto } from '../types/CollabDto'
import { LanguageMode } from '../types/LanguageMode'
import { ChatModel } from '../types'

const collabSchema = new Schema<CollabDto>({
    questionId: {
        type: String,
        required: true,
        unique: true,
    },
    language: {
        type: String,
        enum: Object.values(LanguageMode),
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    executionResult: {
        type: String,
        required: true,
    },
    chatHistory: {
        type: [ChatModel],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
})

export default collabSchema
