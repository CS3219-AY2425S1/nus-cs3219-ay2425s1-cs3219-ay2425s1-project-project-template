import axios from 'axios'
import { Request, Response } from 'express'

const executeCodeController = async (req: Request, res: Response) => {
    const { questionId, code, language } = req.body

    if (!questionId || !code || !language) {
        return res.status(400).json({ message: 'Question ID, code and language are required' })
    }
    
}

export { executeCodeController }