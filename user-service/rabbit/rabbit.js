import * as amqp from 'amqplib'
import "dotenv/config";

const SENDING_EXCHANGE_NAME = 'MATCH-REQUEST-EXCHANGE'
const RECEIVING_EXCHANGE_NAME = 'MATCH-FOUND-EXCHANGE'
const USER_ROUTING_KEY = 'USER-ROUTING-KEY'
const MATCHING_ROUTING_KEY = 'MATCHING-ROUTING-KEY'
const MATCH_FOUND_QUEUE = 'MATCH-FOUND-QUEUE'
const MATCH_REQUEST_QUEUE = 'MATCH-REQUEST-QUEUE'

export const createChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI ? process.env.RABBIT_URI :'amqp://rabbitmq:5672')
        const channel = await connection.createChannel()

        await channel.assertExchange(SENDING_EXCHANGE_NAME, 'direct')
        const matchRequestQueue = await channel.assertQueue(MATCH_REQUEST_QUEUE)
        channel.bindQueue(matchRequestQueue.queue, SENDING_EXCHANGE_NAME, MATCHING_ROUTING_KEY)

        await channel.assertExchange(RECEIVING_EXCHANGE_NAME, 'direct')
        const matchFoundQueue = await channel.assertQueue(MATCH_FOUND_QUEUE)
        channel.bindQueue(matchFoundQueue.queue, RECEIVING_EXCHANGE_NAME, USER_ROUTING_KEY)

        return channel
    } catch (e) {
        console.log(e)
    }
}

export const send = (channel, payload) => {
    try {
        channel.publish(SENDING_EXCHANGE_NAME, MATCHING_ROUTING_KEY, Buffer.from(JSON.stringify(payload)))
    } catch (e) {
        console.log(e)
    }
}

export const receive = async (channel, io) => {
    try {
        channel.consume(MATCH_FOUND_QUEUE, (data) => {
            if (data) {
                const message = data.content.toString()
                console.log('Users matched: ' + message)
                channel.ack(data)

                // Emit socket.io event when a match is found
                const matchData = JSON.parse(message);

                console.log('User 1 Socket ID:', matchData.user1SocketId);
                console.log('Connected sockets:', io.sockets.sockets); 

                const user1Socket = io.sockets.sockets.get(matchData.user1SocketId); // User 1's socket
                // const user2Socket = io.sockets.sockets[matchData.user2SocketId]; // User 2's socket

                // if (user1Socket && user2Socket) {
                if (user1Socket) {
                    // Notify User 1
                    user1Socket.emit('match_found', {
                        success: true,
                        matchedUser: { id: matchData.user2Id },
                    });

                    // Notify User 2
                    // user2Socket.emit('match_found', {
                    //     success: true,
                    //     matchedUser: { id: matchData.user1Id },
                    // });
                }
            }
        })
    } catch (e) {
        console.log(e)
    }
}
