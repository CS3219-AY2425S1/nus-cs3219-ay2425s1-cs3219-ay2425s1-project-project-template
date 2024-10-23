const amqp = require('amqplib');

async function createRabbitMQConnection() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        return { connection, channel };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

module.exports = createRabbitMQConnection;
