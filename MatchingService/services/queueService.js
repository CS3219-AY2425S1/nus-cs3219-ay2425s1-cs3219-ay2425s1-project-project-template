const createRabbitMQConnection = require('../config/rabbitmq');
const QUEUE_NAME = 'match_requests';

async function publishMatchRequest(message) {
    const { channel } = await createRabbitMQConnection();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    console.log('Published message:', message);
}

module.exports = { publishMatchRequest };
