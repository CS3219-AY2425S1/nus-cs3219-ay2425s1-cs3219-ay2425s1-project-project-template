import axios from 'axios'
import { Request, Response } from 'express'
import logger from '../utils/logger'
import { TestCase, languageExtensions } from '../models/types'

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
        const testCases: TestCase[] = question.testCases
        const formattedInput = testCases
            .map((testCase) => testCase.input)
            .join('\n')
        const fileName = `${questionId}.${languageExtensions.get(language)}`

        const executeCodeRes = await axios.post(
            `${process.env.CODE_COMPILER_URL}`,
            {
                language: language,
                stdin: formattedInput,
                files: [
                    {
                        name: fileName,
                        content: code,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
                    "x-rapidapi-key": process.env.ACCESS_TOKEN,
                },
                validateStatus: (status) => status >= 200 && status < 500,
            },
        )

        console.log(executeCodeRes.data)
        return res.status(200).send(executeCodeRes.data)
    } catch (e) {
        logger.error('Error appeared when executing code', e)
        return res
            .status(500)
            .json({ message: 'Error appeared when executing code' })
    }
}

export { executeCodeController }
