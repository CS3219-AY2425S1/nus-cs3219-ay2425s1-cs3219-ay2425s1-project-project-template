import { Request, Response } from 'express'
import { checkQuestionExists, getNextQuestionId } from '../utils/utils'
import Question from '../models/question'

const addQuestion = async (req: Request, res: Response) => {
    const { title, description, categories, difficulty } = req.body

    const cleanedCategories = categories.filter((category: string) => category.trim() !== "")
    const requiredFields: string[] = []

    if (!title) requiredFields.push('Title')
    if (!description) requiredFields.push('Description')
    if (!Array.isArray(cleanedCategories) || cleanedCategories.length === 0) requiredFields.push('Categories')
    if (!difficulty) requiredFields.push('Difficulty')
    
    if (requiredFields.length > 0) {
        return res.status(400).send(`${requiredFields.join(', ')} required`)
    }

    const questionExists = await checkQuestionExists(
        title,
        description,
        cleanedCategories,
        difficulty,
    )

    if (questionExists) {
        return res.status(400).send('Question already exists')
    }

    const questionId = await getNextQuestionId()

    const newQuestion = new Question({
        questionId,
        title,
        description,
        categories,
        difficulty,
    })

    try {
        await newQuestion.save()
        return res.status(200).send('Question added successfully')
    } catch (e) {
        return res.status(500).send(e)
    }
}

export { addQuestion }
