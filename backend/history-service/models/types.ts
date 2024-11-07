import  { Request, Response } from 'express'

export interface GetUserMatchRequest extends Request {
    body: {
        userId: string
    }
}