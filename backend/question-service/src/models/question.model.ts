import { Category } from '../types/Category'
import { Complexity } from '../types/Complexity'
import { IQuestion } from '../types/IQuestion'
import { Schema } from 'mongoose'

const questionSchema = new Schema<IQuestion>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        categories: {
            type: [String],
            enum: Object.values(Category),
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
            unique: true,
        },
    },
    {
        timestamps: true,
    }
)

questionSchema.index({ title: 'text', categories: 1, complexity: 1 })

export default questionSchema
