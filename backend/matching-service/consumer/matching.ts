import { TimedMatchRequest, MatchResponse } from "../models/types"
import logger from '../utils/logger'

const timeout = 5000

const performMatching = (requestQueue: TimedMatchRequest[]) => {
    const currTime = Date.now()

    requestQueue = requestQueue.filter(req => currTime - req.timestamp < timeout)

    for (let i = 0; i < requestQueue.length; i++) {
        for (let j = i + 1; j < requestQueue.length; j++) {
            const first = requestQueue[i]
            const second = requestQueue[j]
            
            if (first.difficulty === second.difficulty) {
                const commonCategories = first.category.filter(category => second.category.includes(category))

                if (commonCategories.length > 0) {
                    const { timestamp: _, ...firstMatch } = first
                    const { timestamp: __, ...secondMatch } = second
                    const match: MatchResponse = { first: firstMatch, second: secondMatch }
                    logger.info(`Matched ${first.name} with ${second.name}`)
                    requestQueue.splice(j, 1)
                    requestQueue.splice(i, 1)
                    break
                }
            }
        }
    }
}

export { performMatching }