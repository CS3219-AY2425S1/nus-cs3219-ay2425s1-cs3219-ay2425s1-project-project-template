const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
const PORT = 3002;

app.use(cors({
    origin: 'http://localhost:3000',  // Your frontend URL
}));

app.use(express.json()); // Middleware to parse JSON request bodies

async function addToQueue(matchData) {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672'); // RabbitMQ connection
        const channel = await connection.createChannel();
        const queue = 'matching-queue'; // Queue name

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(matchData)));

        console.log(`Added to queue: ${JSON.stringify(matchData)}`);
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error adding to queue:', error);
    }
}

app.post('/api/find-match', (req, res) => {
    const { difficulty, topic, language } = req.body;
    if (!difficulty || !topic || !language) {
        return res.status(400).send({ error: 'Missing matching parameters' });
    }
    
    const matchData = { difficulty, topic, language, timestamp: Date.now() };
    
    // Add the match request to the RabbitMQ queue
    addToQueue(matchData);
    res.status(200).send({ status: 'Added to queue', matchData });
});

app.listen(PORT, () => {
    console.log(`Matching service running on http://localhost:${PORT}`);
});
