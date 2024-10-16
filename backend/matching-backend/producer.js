const amqp = require('amqplib');

async function sendMessage(message) {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://rabbitmq:5672'); // Use the service name in Docker Compose
        const channel = await connection.createChannel();

        const queue = 'matching-queue'; // The name of the queue

        // Ensure the queue exists
        await channel.assertQueue(queue, { durable: false });

        // Send message to the queue
        channel.sendToQueue(queue, Buffer.from(message));

        console.log(`Sent: ${message}`);

        // Close the connection after a short delay
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error in sending message:', error);
    }
}

// Example usage
sendMessage('Hello from the matching service!');
