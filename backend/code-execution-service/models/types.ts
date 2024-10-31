import  { Request, Response } from 'express'

export interface CodeExecutionRequest extends Request {
    body: {
        questionId: number
        code: string
        language: string
    }
}

export interface TestCase {
    input: any
    expected: any
}

export interface ExecutionResult {
    input: any,
    expected: any,
    output: any
    passed: boolean
}

export const languageExtensions = new Map([
    ['javascript', 'js'],
    ['python', 'py'],
    ['java', 'java'],
    ['c', 'c'],
])