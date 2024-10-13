import { connect, Connection } from "amqplib"
import { performMatching } from "./matching"
import { TimedMatchRequest } from "../models/types"
import logger from '../utils/logger'

const requestQueue: TimedMatchRequest[] = []

const startConsumer = async () => {
    try {
        const connection: Connection = await connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: false })

        logger.info('Waiting for matching requests...')

        channel.consume(queue, (msg) => {
            if (msg) {
                const { name, difficulty, category } = JSON.parse(msg.content.toString())
                const request: TimedMatchRequest = { name, difficulty, category, timestamp: Date.now() }
                logger.info(`Received matching request: ${JSON.stringify(request)}`)
                requestQueue.push(request)
                console.log(requestQueue)
                performMatching(requestQueue)
            }
        }, { noAck: true })
    } catch (error: any) {
        logger.error(`Error occurred while consuming matching requests: ${error.message}`)
        throw error
    }
}

export { startConsumer }