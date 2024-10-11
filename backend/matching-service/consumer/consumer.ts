import { connect, Connection } from "amqplib"
import logger from '../utils/logger'

const completeMatchRequest = async () => {
    try {
        const connection: Connection = await connect('amqp:localhost')
        const channel = await connection.createChannel()

        const queue = 'matching_requests'
        await channel.assertQueue(queue, { durable: true })

        logger.info('Waiting for matching requests...')
    } catch (error) {
        
    }

}

const performMatching = (data: any) => {

}

export { completeMatchRequest }