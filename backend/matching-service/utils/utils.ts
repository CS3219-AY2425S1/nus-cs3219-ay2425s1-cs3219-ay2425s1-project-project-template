import SuccessfulMatch from '../models/match'
import logger from '../utils/logger'

const addMatch = async (payload: any) => {
    const { matchId, collaborators, questionId } = payload

    if (!matchId || !collaborators || collaborators.length == 0 || !questionId) {
        return
    }

    const match = new SuccessfulMatch({
        matchId,
        collaborators,
        questionId
    })

    try {
        await match.save()
        logger.info(`Match ${matchId} saved to database`)
    } catch (e) {
        logger.error('Error adding match to database', e)
    }
}

export { addMatch  }