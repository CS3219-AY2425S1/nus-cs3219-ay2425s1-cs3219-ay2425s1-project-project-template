import { connect, Connection, Channel } from 'amqplib'
import { Server } from 'socket.io'
import { performMatching } from './matching'
import { TimedMatchRequest, MatchPartner } from '../models/types'
import logger from '../utils/logger'
import { sendMatchResult } from './sendMatchResults'

const requestQueue: TimedMatchRequest[] = []
const MATCH_TIMEOUT = 15000 // 15 seconds
let isMatching: boolean = false

const startConsumer = async (
    io: Server,
    connectedClients: Map<string, string>,
) => {
    let connection: Connection | null = null
    let channel: Channel | null = null

    const maxRetries = 3
    const retryDelay = 13000 // 13 seconds
    const rabbitUrl: string = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'
    const queueName = 'matching_requests'

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger.info(`Attempt ${attempt}: Connecting to RabbitMQ at ${rabbitUrl}`, { service: 'matching-service', timestamp: new Date().toISOString() })
            connection = await connect(rabbitUrl)
            channel = await connection.createChannel()
            await channel.assertQueue(queueName, { durable: false })

            logger.info('Connected to RabbitMQ and waiting for matching requests...', { service: 'matching-service', timestamp: new Date().toISOString() })
            break
        } catch (error: any) {
            logger.error(`Attempt ${attempt}: Failed to connect to RabbitMQ: ${error.message}`, { service: 'matching-service', timestamp: new Date().toISOString() })
            if (attempt === maxRetries) {
                logger.error('Max retries reached. Exiting.', { service: 'matching-service', timestamp: new Date().toISOString() })
                process.exit(1)
            }
            logger.info(`Retrying in ${retryDelay / 1000} seconds...`, { service: 'matching-service', timestamp: new Date().toISOString() })
            await new Promise(res => setTimeout(res, retryDelay))
        }
    }

    if (!channel) {
        logger.error('Channel was not created. Exiting.', { service: 'matching-service', timestamp: new Date().toISOString() })
        process.exit(1)
    }

    channel.consume(
        queueName,
        (msg: any) => {
            if (msg) {
                const { userId, userName, difficulty, categories } = JSON.parse(
                    msg.content.toString(),
                )
                const request: TimedMatchRequest = {
                    userId,
                    userName,
                    difficulty,
                    categories,
                    timestamp: Date.now(),
                }
                logger.info(
                    `Received matching request: ${JSON.stringify(request)}`,
                    { service: 'matching-service', timestamp: new Date().toISOString() }
                )
                requestQueue.push(request)
                logger.info(`Request Queue: ${JSON.stringify(requestQueue, null, 2)}`, { service: 'matching-service', timestamp: new Date().toISOString() })

                setTimeout(() => {
                    processMatching(request, io, connectedClients)
                }, MATCH_TIMEOUT)
            }
        },
        { noAck: true },
    )

    const removeRequest = (userId: string) => {
        const index = requestQueue.findIndex((x) => x.userId === userId)
        if (index !== -1) {
            requestQueue.splice(index, 1)
            logger.info(`User ${userId} has been removed from the queue via cancellation`, { service: 'matching-service', timestamp: new Date().toISOString() })
        } else {
            logger.info(`User ${userId} not found in the queue during cancellation`, { service: 'matching-service', timestamp: new Date().toISOString() })
        }
    }

    return { removeRequest }
}

const processMatching = async (
    req: TimedMatchRequest,
    io: Server,
    connectedClients: Map<string, string>,
) => {
    if (isMatching) {
        setTimeout(() => processMatching(req, io, connectedClients), 100)
        return
    }

    isMatching = true

    try {
        let reqIndex = requestQueue.findIndex((x) => x.userId === req.userId)

        if (reqIndex === -1) {
            logger.info(`${req.userId} has already been matched and removed from the queue`, { service: 'matching-service', timestamp: new Date().toISOString() })
            return
        }

        const currTime = Date.now()
        const activeRequests = requestQueue.filter(
            (r) => currTime - r.timestamp <= MATCH_TIMEOUT,
        )

        const matchPartner = await performMatching(req, activeRequests)
        
        if (reqIndex !== -1) {
            requestQueue.splice(reqIndex, 1)
            logger.info(`${req.userId} has been removed from the queue`, { service: 'matching-service', timestamp: new Date().toISOString() })
        }

        if (matchPartner) {
            sendMatchResult(req, matchPartner, io, connectedClients)
            let partnerIndex = requestQueue.findIndex(
                (x) => x.userId === matchPartner.userId,
            )
            if (partnerIndex !== -1) {
                requestQueue.splice(partnerIndex, 1)
                logger.info(`${matchPartner.userId} has been removed from the queue`, { service: 'matching-service', timestamp: new Date().toISOString() })
            }
            return
        } else {
            const requestSockId = connectedClients.get(req.userId)

            if (requestSockId) {
                io.to(requestSockId).emit('noMatchFound', {
                    message: 'No suitable match found at this time',
                })
            }
        }
    } catch (error: any) {
        logger.error(`Error during matching process: ${error.message}`, { service: 'matching-service', timestamp: new Date().toISOString() })
    } finally {
        isMatching = false
        logger.info(`Request Queue: ${JSON.stringify(requestQueue, null, 2)}`, { service: 'matching-service', timestamp: new Date().toISOString() })
    }
}

export { startConsumer }
