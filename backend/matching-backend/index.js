const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

async function sendMessage(userId) {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const queue = 'matching-queue';

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(userId));

        console.log(`Sent: ${userId}`);
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error in sending message:', error);
    }
}

app.post('/api/match-user', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }
    
    sendMessage(userId);
    res.status(200).send({ status: 'User ID sent for matching', userId });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
