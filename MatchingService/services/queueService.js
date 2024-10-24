import connectRabbitMQ from '../config/rabbitmq.js';
import QueueModel from '../models/queue-model.js';

const QUEUE_NAME = 'match_requests';

async function publishMatchRequest(message) {
    const { channel } = await connectRabbitMQ();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));

    console.log('Published message to RabbitMQ:', message);
}

async function consumeMatchRequests(processMessage) {
    try {
        const { channel } = await connectRabbitMQ();
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());

                const { userId } = message;

                // Check if the user is still in the Redis queue
                const isUserInQueue = await QueueModel.isUserInQueue(userId);

                console.log('Consumed message from RabbitMQ:', message);

                try {
                    // If not in Redis queue means that the user either cancelled or timeout, skip processing
                    if (isUserInQueue) {
                        await processMessage(message);
                    }
                    channel.ack(msg);
                } catch (error) {
                    throw new Error('Error processing message:');
                    channel.nack(msg);
                }
            }
        });
    } catch (error) {
        throw new Error('Error consuming message:');
    }
}

export default { publishMatchRequest, consumeMatchRequests };
