const createRabbitMQConnection = require('../config/rabbitmq');
const QUEUE_NAME = 'match_requests';

async function publishMatchRequest(message) {
    const { channel } = await createRabbitMQConnection();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    console.log('Published message:', message);
}

async function consumeMatchRequests(onMessage) {
    try {
        const { channel } = await createRabbitMQConnection();
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log('Consumed message:', message);

                try {
                    await onMessage(message);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
}

module.exports = { publishMatchRequest, consumeMatchRequests };
