import client, { Connection, Channel } from 'amqplib'

import config from '../common/config.util'
import { IUserQueueMessage } from '../types/IUserQueueMessage'
import logger from '../common/logger.util'

class RabbitMQConnection {
    connection!: Connection
    channel!: Channel
    private connected!: boolean

    async connect() {
        if (this.connected && this.channel) return
        else this.connected = true

        try {
            logger.info(`[Init] Connecting to Rabbit-MQ Server`)
            this.connection = await client.connect({
                protocol: 'amqp',
                hostname: config.RMQ_HOST,
                port: 5672,
                username: config.RMQ_USER,
                password: config.RMQ_PASSWORD,
            })

            logger.info(`[Init] Rabbit MQ Connection is ready`)

            this.channel = await this.connection.createChannel()

            logger.info(`[Init] Created RabbitMQ Channel successfully`)
        } catch (error) {
            this.connected = false
            logger.error(`[Error] Not connected to MQ Server: ${error}`)
        }
    }

    // Direct exchange for entry queue
    async sendToEntryQueue(message: IUserQueueMessage) {
        try {
            if (!this.channel) {
                await this.connect()
            }

            // Set durable true to ensure queue stays even with mq restart (does not include message persistance)
            await this.channel.assertExchange('Entry-Queue', 'direct', { durable: false })

            await this.channel.assertQueue('entry_queue', { durable: false })

            // Params: Queue, Exchange, Routing Key
            await this.channel.bindQueue('entry_queue', 'Entry-Queue', 'entry')
            this.channel.publish('Entry-Queue', 'entry', Buffer.from(JSON.stringify(message)))
        } catch (error) {
            logger.error(`[Error] Failed to send message to Entry-Queue: ${error}`)
            throw error
        }
    }

    async entryConsumer() {
        try {
            await this.channel.assertExchange('Entry-Queue', 'direct', { durable: false })
            const q = await this.channel.assertQueue('entry_queue', { durable: false })
            await this.channel.bindQueue(q.queue, 'Entry-Queue', 'entry')
            this.channel.consume(
                q.queue,
                (msg) => {
                    if (msg.content) {
                        // Insert logic to check for possible match before re-queuing
                        logger.info('[Entry-Queue] User information queued ', msg.content.toString())
                        this.channel.ack(msg) // ACK removes message from queue
                    }
                },
                { noAck: false }
            )
        } catch (error) {
            logger.error(`[Error] Failed to consume Entry-Queue: ${error}`)
            throw error
        }
    }
}

const mqConnection = new RabbitMQConnection()

export default mqConnection
