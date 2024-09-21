import { Schema } from 'mongoose'
import { Complexity } from '../types/Complexity'
import { IQuestion } from '../types/IQuestion'

export default new Schema<IQuestion>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        categories: {
            type: [String],
            required: true,
        },
        complexity: {
            type: String,
            enum: Object.values(Complexity),
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)
