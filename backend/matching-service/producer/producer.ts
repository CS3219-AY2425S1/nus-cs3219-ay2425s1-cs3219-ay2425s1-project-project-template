import { connect, Connection } from 'amqplib'
import logger from '../utils/logger'

const sendMatchingRequest = async (data: any) => {
    try {
        const connection: Connection = await connect('amqp:localhost')
        const channel = await connection.createChannel()
        
        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: false })

        channel.sendToQueue(queue, Buffer.from(data))
        logger.info(`Sent matching request to queue: ${data}`)

        setTimeout(() => {
            connection.close()
        }, 500)
    } catch (error: any) {
        logger.error(`Error occurred while sending matching request to queue: ${error.message}`)
        throw error
    }
    
}

export { sendMatchingRequest }