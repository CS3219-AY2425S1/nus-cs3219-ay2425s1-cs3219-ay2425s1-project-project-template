import  { Request, Response } from 'express'
import { Types } from 'mongoose'

export interface CodeExecutionRequest extends Request {
    body: {
        questionId: number
        code: string
        language: string
    }
}