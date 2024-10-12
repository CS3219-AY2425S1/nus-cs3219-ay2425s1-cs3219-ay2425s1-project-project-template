import { connect, Connection } from 'amqplib'
import logger from '../utils/logger'

const sendMatchingRequest = async (data: any) => {
    try {
        const connection: Connection = await connect(
            'amqp://guest:guest@localhost',
        )
        const channel = await connection.createChannel()

        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: false })

        const msg = JSON.stringify(data)
        channel.sendToQueue(queue, Buffer.from(msg))
        logger.info(`Sent matching request to queue: ${msg}`)

        setTimeout(() => {
            connection.close()
        }, 500)
    } catch (error: any) {
        logger.error(
            `Error occurred while sending matching request to queue: ${error.message}`,
        )
        throw error
    }
}

export { sendMatchingRequest }
