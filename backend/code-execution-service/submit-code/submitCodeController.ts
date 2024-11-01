import axios from 'axios'
import { Response } from 'express'
import logger from '../utils/logger'
import { CodeSubmissionRequest, ExecutionResult, TestCase, languageExtensions } from '../models/types'
import { formatTestInput, countNumberOfPassedTestCases, passedAllTestCases } from '../utils/utils'
import Submission from '../models/submission'

const submitUserCode = async (req: CodeSubmissionRequest, res: Response): Promise<Response> => {
    const { questionId, collaborators, code, language } = req.body

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

        if (!getQuestionRes.data || getQuestionRes.data.length === 0) {
            logger.error('Question not found')
            return res.status(400).json({ message: 'Question not found' })
        }

        const question = getQuestionRes.data[0]
        const testCases: TestCase[] = question.testCases
        // similar to Kattis where input is separated by a blank line
        const formattedInput = testCases
            .map((tc) => formatTestInput(tc.input))
            .join('\n')
        const fileName = `q${questionId}.${languageExtensions.get(language)}`
        const payload = {
            language: language.toLowerCase(),
            stdin: formattedInput,
            files: [
                {
                    name: fileName,
                    content: code,
                },
            ],
            compileOnly: false,
            wait: true,
        }

        logger.info(`Sending request to OneCompiler`, {
            code,
            language,
            formattedInput,
        })
        const executeCodeRes = await axios.post(
            `${process.env.CODE_COMPILER_URL}`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
                    'x-rapidapi-key': process.env.ACCESS_TOKEN,
                },
                validateStatus: (status) => status >= 200 && status < 500,
            },
        )

        logger.info('OneCompiler response', executeCodeRes.data)

        if (executeCodeRes.data.stderr) {
            logger.error(
                'Error appeared when executing code',
                executeCodeRes.data.stderr,
            )
            return res.status(400).json({
                success: false,
                error: executeCodeRes.data.stderr,
                compilationOutput: executeCodeRes.data.compilationOutput,
            })
        }

        const codeOutput = (executeCodeRes.data.stdout || '').trim().split('\n')
        const results: ExecutionResult[] = testCases.map((tc, i) => ({
            input: tc.input,
            expected: tc.expected,
            output: codeOutput[i]?.trim() || '',
            passed: String(tc.expected) == codeOutput[i]?.trim(),
        }))
        
        const submission = new Submission({
            collaborators,
            questionId,
            code,
            language,
            solved: passedAllTestCases(results),
            testCasesPassed: countNumberOfPassedTestCases(results),
            testCasesTotal: testCases.length,
        })
        await submission.save()

        logger.info('Submission saved successfully', submission)
        return res.status(200).json(submission)
    } catch (e) {
        logger.error('Error appeared when executing code', e)
        return res
            .status(500)
            .json({ message: 'Error appeared when executing code' })
    }
}

export { submitUserCode }
