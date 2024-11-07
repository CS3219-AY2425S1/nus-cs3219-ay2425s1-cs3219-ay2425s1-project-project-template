import  { Request, Response } from 'express'
import { Types } from 'mongoose'

export interface GetUserMatchRequest extends Request {
    body: {
        userId: string
    }
}