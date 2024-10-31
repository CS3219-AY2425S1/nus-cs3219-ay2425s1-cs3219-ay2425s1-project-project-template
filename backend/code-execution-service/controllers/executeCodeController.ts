import axios from 'axios'
import { Request, Response } from 'express'
import logger from '../utils/logger'

const executeCodeController = async (req: any, res: any) => {
    const { questionId, code, language } = req.body

    if (!questionId || !code || !language) {
        return res
            .status(400)
            .json({ message: 'Question ID, code and language are required' })
    }

    try {
        const getQuestionRes = await axios.get(
            `${process.env.QUESTION_SERVICE_URL}/get-questions`,
            {
                params: { questionId },
                validateStatus: (status) => status >= 200 && status < 500,
            },
        )

        if (!getQuestionRes.data) {
            return res.status(400).json({ message: 'Question not found' })
        }

        const question = getQuestionRes.data[0]
        const testCases = question.testCases
        
        const executeCodeRes = await axios.post(
            `${process.env.CODE_COMPILER_URL}/execute-code`,
            { code, language, testCases },
            { validateStatus: (status) => status >= 200 && status < 500 },
        )

        console.log(executeCodeRes.data)
        return res.status(200).send(executeCodeRes.data)

    } catch (e) {
        logger.error('Error appeared when retrieving question', e)
        return res
            .status(500)
            .json({ message: 'Error appeared when retrieving question' })
    }
}

export { executeCodeController }
