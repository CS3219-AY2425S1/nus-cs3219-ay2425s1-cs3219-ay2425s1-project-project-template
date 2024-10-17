const amqp = require('amqplib');

async function matchUsers() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const queue = 'matching-queue';

        await channel.assertQueue(queue, { durable: false });
        console.log('Waiting for messages in %s', queue);

        channel.consume(queue, (msg) => {
            const userId = msg.content.toString();
            console.log(`Received userId: ${userId}`);

            // Implement your dynamic matching logic here
            // E.g., match the userId with another userId in the queue
            
            channel.ack(msg); // Acknowledge the message has been processed
        });
    } catch (error) {
        console.error('Error in matching users:', error);
    }
}

matchUsers();
