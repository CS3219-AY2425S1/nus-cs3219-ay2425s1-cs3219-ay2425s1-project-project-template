import { Request, Response } from 'express'
import Question from '../models/question'

const editQuestion = async (req: Request, res: Response) => {
    const { questionId } = req.params
    const { title, description, categories, difficulty } = req.body

    if (!questionId) {
        return res.status(400).send('Question ID required')
    }

    try {
        const updatedFields: any = {}

        if (title) updatedFields.title = title
        if (description) updatedFields.description = description
        if (categories) updatedFields.categories = categories
        if (difficulty) updatedFields.difficulty = difficulty

        const updatedQuestion = await Question.findOneAndUpdate(
            { questionId },
            { $set: updatedFields },
            { new: true, runValidators: true }
        )

        if (!updatedQuestion) {
            return res.status(404).send('Question not found')
        }

        return res.status(200).json(updatedQuestion)
    } catch (e) {
        return res.status(500).send('Error appeared when updating question')
    }
}

export { editQuestion }
