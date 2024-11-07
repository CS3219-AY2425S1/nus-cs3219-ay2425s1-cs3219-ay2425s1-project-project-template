import { Response } from "express"
import Submission from "../models/submission"
import logger from "../utils/logger"
import { GetCodeRequest } from "../models/types"

const getUserMatchHistory = async (req: GetUserMatchRequest, res: Response) => {
    const { userId } = req.params

    try {
        const submissions = await Submission.find({ userId })
        logger.info(`Successfully fetched past successful matches for user ${userId}`)
        return res.status(200).json(submissions)
    } catch (e) {
        logger.error(`Error fetching past successful matches for match ${userId}`)
        return res.status(500).json({ message: 'Error fetching past successful matches' })
    }
}

export { getUserMatchHistory }