import { connect, Connection } from "amqplib"
import logger from '../utils/logger'

const completeMatchRequest = async () => {
    try {
        const connection: Connection = await connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: false })

        logger.info('Waiting for matching requests...')

        channel.consume(queue, (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString())
                logger.info(`Received matching request: ${JSON.stringify(data, null, 2)}`)
                performMatching(data)
            }
        }, { noAck: true })
    } catch (error: any) {
        logger.error(`Error occurred while consuming matching requests: ${error.message}`)
        throw error
    }
}

const performMatching = (data: any) => {

}

export { completeMatchRequest }