import { Schema } from 'mongoose'
import { Category } from '../types/Category'
import { Complexity } from '../types/Complexity'
import { IQuestion } from '../types/IQuestion'

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

// This should cover most possible queries, note that text indexes cannot include multikey indexes, so we need to create separate indexes for title and categories

// Index to support text search by title and sorting by complexity
questionSchema.index({ title: 'text', complexity: 1 })
// Index to support filter by categories and sorting by complexity, including prefixes where we filter by categories only
questionSchema.index({ categories: 1, complexity: 1 })
// Index to support sorting by complexity only
questionSchema.index({ complexity: 1 })

export default questionSchema
