import { Response } from "express"
import SuccessfulMatch from "../models/match"
import logger from "../utils/logger"
import { GetUserMatchRequest } from "../models/types"

const getUserMatchHistory = async (req: GetUserMatchRequest, res: Response) => {
    const { userId } = req.params

    try {
        const successfulMatches = await SuccessfulMatch.find({ 
            collaborators: { $in: [userId] }
        }).sort({ createdAt: -1 })

        logger.info(`Successfully fetched past successful matches for user ${userId}`)
        return res.status(200).json(successfulMatches)
    } catch (e) {
        logger.error(`Error fetching past successful matches for user ${userId}`)
        return res.status(500).json({ message: 'Error fetching past successful matches' })
    }
}

export { getUserMatchHistory }