// matchingService.js
const amqp = require('amqplib');
const express = require('express');

const app = express();
const PORT = 4001;

app.use(express.json());

let connection;
let channel;

async function initRabbitMQ() {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Declare queues
  await channel.assertQueue('search_queue');
  await channel.assertQueue('disconnect_queue'); 
}

app.post('/search', (req, res) => {
  const { userId, difficulty, topics } = req.body;

  if (!userId || !difficulty || !Array.isArray(topics)) {
    return res.status(400).json({ error: 'Invalid request body. Please provide userId, difficulty, and topics.' });
  }

  const searchRequest = { userId, difficulty, topics };
  
  channel.sendToQueue('search_queue', Buffer.from(JSON.stringify(searchRequest)));

  res.status(202).json({ message: 'Search request has been accepted.', userId });
});

app.delete('/search/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'Invalid request. Please provide a userId.' });
  }

  channel.sendToQueue('disconnect_queue', Buffer.from(JSON.stringify({ userId })));

  res.status(202).json({ message: 'Disconnect request has been accepted.', userId });
});

initRabbitMQ();

app.listen(PORT, () => {
  console.log(`Matching service is running and listening on port ${PORT}`);
});
