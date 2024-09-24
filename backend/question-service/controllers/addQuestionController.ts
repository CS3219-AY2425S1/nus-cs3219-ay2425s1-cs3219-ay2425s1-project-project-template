import { Request, Response } from 'express'
import { checkQuestionExists, getNextQuestionId } from '../utils/utils'
import Question from '../models/question'

const addQuestion = async (req: Request, res: Response) => {
    const { title, description, categories, difficulty } = req.body

    const questionExists = await checkQuestionExists(
        title,
        description,
        categories,
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
