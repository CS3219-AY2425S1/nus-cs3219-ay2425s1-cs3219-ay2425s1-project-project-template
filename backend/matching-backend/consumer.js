const amqp = require('amqplib');

async function consumeMessages() {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://rabbitmq:5672'); // Use the service name in Docker Compose
        const channel = await connection.createChannel();

        const queue = 'matching-queue'; // The name of the queue

        // Ensure the queue exists
        await channel.assertQueue(queue, { durable: false });

        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        // Consume messages from the queue
        channel.consume(queue, (msg) => {
            console.log(`Received: ${msg.content.toString()}`);
            channel.ack(msg); // Acknowledge the message
        }, { noAck: false });
    } catch (error) {
        console.error('Error in consuming message:', error);
    }
}

// Start consuming messages
consumeMessages();