var amqp = require('amqplib');
const dotenv = require('dotenv').config();

const SENDING_EXCHANGE_NAME = 'MATCH-FOUND-EXCHANGE'
const RECEIVING_EXCHANGE_NAME = 'MATCH-REQUEST-EXCHANGE'
const ROUTING_KEY = 'MATCHING-ROUTING-KEY'
const QUEUE_NAME = 'MATCH-REQUEST-QUEUE'

exports.createChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI ? process.env.RABBIT_URI :'amqp://rabbitmq:5672')
        const channel = await connection.createChannel()
        await channel.assertExchange(SENDING_EXCHANGE_NAME, 'direct')
        await channel.assertExchange(RECEIVING_EXCHANGE_NAME, 'direct')
        return channel
    } catch (e) {
        console.log(e)
    }
}

exports.send = (channel, routing_key, payload) => {
    try {
        channel.publish(SENDING_EXCHANGE_NAME, routing_key, payload)
    } catch (e) {
        console.log(e)
    }
}

exports.receive = async (channel, callback) => {
    try {
        const queue = await channel.assertQueue(QUEUE_NAME) 
        channel.bindQueue(queue.queue, RECEIVING_EXCHANGE_NAME, ROUTING_KEY)
        channel.consume(queue.queue, (data) => {
            if (data) {
                console.log('Match request arrived: ' + data.content.toString());
                callback(data);  // Pass the message data to the callback
                channel.ack(data);  // Acknowledge the message
            } else {
                console.log('No data received');
            }
        });
    } catch(e) {
        console.log(e)
    }
}
