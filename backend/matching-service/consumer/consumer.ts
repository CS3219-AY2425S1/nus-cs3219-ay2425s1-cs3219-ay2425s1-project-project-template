import { connect, Connection } from 'amqplib'
import { Server } from 'socket.io'
import { performMatching } from './matching'
import { TimedMatchRequest } from '../models/types'
import logger from '../utils/logger'
import { sendMatchResult } from './sendMatchResults'

const requestQueue: TimedMatchRequest[] = []
const MATCH_TIMEOUT = 5000
let isMatching: boolean = false

const startConsumer = async (
    io: Server,
    connectedClients: Map<string, string>,
) => {
    try {
        const connection: Connection = await connect(
            'amqp://guest:guest@localhost',
        )
        const channel = await connection.createChannel()

        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: false })

        logger.info('Waiting for matching requests...')

        channel.consume(
            queue,
            (msg) => {
                if (msg) {
                    const { name, difficulty, category } = JSON.parse(
                        msg.content.toString(),
                    )
                    const request: TimedMatchRequest = {
                        name,
                        difficulty,
                        category,
                        timestamp: Date.now(),
                    }
                    logger.info(
                        `Received matching request: ${JSON.stringify(request)}`,
                    )
                    requestQueue.push(request)
                    console.log(requestQueue)

                    setTimeout(() => {
                        processMatching(request, io, connectedClients)
                    }, MATCH_TIMEOUT)
                }
            },
            { noAck: true },
        )
    } catch (error: any) {
        logger.error(
            `Error occurred while consuming matching requests: ${error.message}`,
        )
        throw error
    }
}

const processMatching = async (
    req: TimedMatchRequest,
    io: Server,
    connectedClients: Map<string, string>,
) => {
    if (isMatching) {
        setTimeout(() => processMatching(req, io, connectedClients), 100)
    }

    // lock
    isMatching = true

    try {
        const currTime = Date.now()
        const activeRequests = requestQueue.filter(
            (req) => currTime - req.timestamp <= MATCH_TIMEOUT,
        )

        const matchPartner = performMatching(req, activeRequests)
        let reqIndex = requestQueue.findIndex((x) => x.name == req.name)
        requestQueue.splice(reqIndex, 1)

        if (matchPartner) {
            sendMatchResult(req, matchPartner, io, connectedClients)
            let partnerIndex = requestQueue.findIndex(
                (x) => x.name == matchPartner.name,
            )
            requestQueue.splice(partnerIndex, 1)
            return
        } else {
            const requestSockId = connectedClients.get(req.name)

            if (requestSockId) {
                io.to(requestSockId).emit('noMatchFound', {
                    message: 'No suitable match found at this time ',
                })
            }
        }
    } finally {
        isMatching = false
    }
}

export { startConsumer }
