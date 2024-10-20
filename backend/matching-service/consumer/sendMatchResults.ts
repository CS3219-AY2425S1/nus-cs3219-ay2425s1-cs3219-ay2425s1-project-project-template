import { Server } from 'socket.io'
import { TimedMatchRequest, MatchPartner } from '../models/types'
import logger from '../utils/logger'

const sendMatchResult = async (
    req: TimedMatchRequest,
    partner: MatchPartner,
    io: Server,
    connectedClients: Map<string, string>,
) => {
    const requestSockId = connectedClients.get(req.name)
    const partnerSockId = connectedClients.get(partner.name)

    if (requestSockId) {
        io.to(requestSockId).emit('matchFound', partner)
    }

    if (partnerSockId) {
        const requester: MatchPartner = {
            name: req.name,
            questionId: partner.questionId,
            title: partner.title,
            difficulty: req.difficulty,
            categories: partner.categories,
        }

        io.to(partnerSockId).emit('matchFound', requester)
    }

    logger.info(`Match partners sent to ${req.name} and ${partner.name}`)
}

export { sendMatchResult }
