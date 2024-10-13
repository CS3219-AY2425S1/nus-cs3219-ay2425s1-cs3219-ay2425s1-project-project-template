import { TimedMatchRequest, MatchPartner } from "../models/types"
import logger from '../utils/logger'

const performMatching = (req: TimedMatchRequest, activeRequests: TimedMatchRequest[]): MatchPartner | null => {
    let bestMatch: TimedMatchRequest | null = null
    let maxCommonCategories = 0

    for (const curr of activeRequests) {
        if (curr.name === req.name) continue 

        if (curr.difficulty === req.difficulty) {
            const commonCategories = req.category.filter(category => 
                curr.category.includes(category)
            )

            if (commonCategories.length > maxCommonCategories) {
                maxCommonCategories = commonCategories.length
                bestMatch = curr
            }
        }
    }

    if (bestMatch) {
        const matchPartner: MatchPartner = {
            name: bestMatch.name,
            difficulty: bestMatch.difficulty,
            category: bestMatch.category
        }
        logger.info(`Matched ${req.name} with ${bestMatch.name}`)
        return matchPartner
    }
    return null
}

export { performMatching }