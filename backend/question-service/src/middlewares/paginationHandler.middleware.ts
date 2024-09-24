import { NextFunction, Request, Response } from 'express'

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10)
    const limit = parseInt(req.query.limit as string, 10)

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        return res.status(400).json({ error: 'Invalid page or limit' })
    }

    next()
}
