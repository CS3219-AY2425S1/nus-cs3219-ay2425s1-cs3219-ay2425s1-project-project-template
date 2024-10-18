import * as amqp from 'amqplib'

const SENDING_EXCHANGE_NAME = 'MATCH-REQUEST-EXCHANGE'
const RECEIVING_EXCHANGE_NAME = 'MATCH-FOUND-EXCHANGE'
const USER_ROUTING_KEY = 'USER-ROUTING-KEY'
const MATCHING_ROUTING_KEY = 'MATCHING-ROUTING-KEY'
const MATCH_FOUND_QUEUE = 'MATCH-FOUND-QUEUE'
const MATCH_REQUEST_QUEUE = 'MATCH-REQUEST-QUEUE'

export const createChannel = async () => {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672')
        const channel = await connection.createChannel()

        await channel.assertExchange(SENDING_EXCHANGE_NAME, 'direct')
        const matchRequestQueue = await channel.assertQueue(MATCH_REQUEST_QUEUE) 
        channel.bindQueue(matchRequestQueue.queue, SENDING_EXCHANGE_NAME, MATCHING_ROUTING_KEY)

        await channel.assertExchange(RECEIVING_EXCHANGE_NAME, 'direct')
        const matchFoundQueue = await channel.assertQueue(MATCH_FOUND_QUEUE)
        channel.bindQueue(matchFoundQueue.queue, RECEIVING_EXCHANGE_NAME, USER_ROUTING_KEY)

        return channel 
    } catch(e) {
        console.log(e)
    }
}

export const send = (channel, payload) => {
    try {
        channel.publish(SENDING_EXCHANGE_NAME, MATCHING_ROUTING_KEY, Buffer.from(JSON.stringify(payload)))
    } catch(e) {
        console.log(e)
    }
}

export const receive = async (channel) => {
    try {
        channel.consume(MATCH_FOUND_QUEUE, (data) => {
            if (data) {
                const message = data.content.toString()
                console.log('Users matched: ' + message)
                channel.ack(data)
            }
        })
    } catch(e) {
        console.log(e)
    }
}
