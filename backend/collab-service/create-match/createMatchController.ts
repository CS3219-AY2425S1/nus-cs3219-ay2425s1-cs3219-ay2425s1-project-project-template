import { Request, Response } from 'express'
import SuccessfulMatch from '../models/match'
import { CreateMatchRequest } from '../models/types'
import logger from '../utils/logger'

const addMatch = async (req: CreateMatchRequest, res: Response) => {
    const { collaborators, questionId } = req.body

    if (!collaborators || collaborators.length == 0 || !questionId) {
        return res
            .status(400)
            .json({ message: 'Collaborators and question ID are required' })
    }

    const match = new SuccessfulMatch({
        collaborators,
        questionId
    })

    try {
        await match.save()
    } catch (e) {
        logger.error('Error adding match to database', e)
        return res.status(500).json({ message: 'Error adding match to database' })
    }
}

export { addMatch  }