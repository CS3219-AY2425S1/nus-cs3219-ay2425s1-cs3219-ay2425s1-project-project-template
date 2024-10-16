const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = 3000; // Change this port if necessary

app.use(express.json()); // Middleware to parse JSON request bodies

async function sendMessage(message) {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672'); // Connection string
        const channel = await connection.createChannel();
        const queue = 'matching-queue'; // Your queue name

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(message));

        console.log(`Sent: ${message}`);
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error in sending message:', error);
    }
}

// POST endpoint to trigger message sending
app.post('/api/send-message', (req, res) => {
    const { message } = req.body; // Expecting { "message": "your message" }
    if (!message) {
        return res.status(400).send({ error: 'Message is required' });
    }
    
    sendMessage(message);
    res.status(200).send({ status: 'Message sent', message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
