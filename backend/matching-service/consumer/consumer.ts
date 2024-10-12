import { connect, Connection } from "amqplib"
import { performMatching } from "./matching"
import logger from '../utils/logger'

const startConsumer = async () => {
    try {
        const connection: Connection = await connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: false })

        logger.info('Waiting for matching requests...')

        channel.consume(queue, (msg) => {
            if (msg) {
                logger.info(`Received matching request: ${msg.content}`)
                performMatching(msg.content)
            }
        }, { noAck: true })
    } catch (error: any) {
        logger.error(`Error occurred while consuming matching requests: ${error.message}`)
        throw error
    }
}

export { startConsumer }