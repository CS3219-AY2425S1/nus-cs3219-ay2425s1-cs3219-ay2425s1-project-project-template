const createRabbitMQConnection = require('../config/rabbitmq');

async function publishMatchRequest(message) {
    const { channel } = await createRabbitMQConnection();
    await channel.assertQueue('match_requests', { durable: true });
    channel.sendToQueue('match_requests', Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log('Published message:', message);
}

module.exports = { publishMatchRequest };
