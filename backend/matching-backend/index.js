const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
const WebSocket = require('ws');
const startConsumer = require('./consumer');

const app = express();
const PORT = 3002;

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());

let channel, connection;
let wss;

async function initRabbitMQ() {
    try {
        connection = await amqp.connect('amqp://rabbitmq:5672');
        channel = await connection.createChannel();
        await channel.assertQueue('matching-queue', { durable: true });
        console.log('Connected to RabbitMQ');
        startConsumer(channel, notifyMatch); // Start consumer
    } catch (error) {
        console.error('Error connecting to RabbitMQ: ', error);
    }
}

// WebSocket to notify matched users
function notifyMatch(user1, user2) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                matchFound: true,
                user1: user1.username,
                user2: user2.username
            }));
        }
    });
}

async function addToQueue(matchData) {
    try {
        if (!channel) {
            console.error('Channel is not initialized');
            return;
        }
        const queue = 'matching-queue';
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(matchData)));
        console.log(`Added to queue: ${JSON.stringify(matchData)}`);

    } catch (error) {
        console.error('Error adding to queue:', error);
    }
}

app.post('/api/find-match', (req, res) => {
    const { username, difficulty, topic, language } = req.body;
    if (!username || !difficulty || !topic || !language) {
        return res.status(400).send({ error: 'Missing matching parameters' });
    }
    
    const matchData = { username, difficulty, topic, language, timestamp: Date.now() };
    
    // Add the match request to the RabbitMQ queue
    addToQueue(matchData);
    res.status(200).send({ status: 'Added to queue', matchData });
});

app.post('/api/cancel-match', (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).send({ error: 'Username is required to cancel match' });
    }
  
    // Publish a message to the queue to remove the user
    cancelMatch(username);
    res.status(200).send({ status: 'Cancel request sent', username });
  });
  
  // Function to notify the consumer to cancel the user
  function cancelMatch(username) {
    if (!channel) {
      console.error('Channel is not initialized');
      return;
    }
    
    const cancelQueue = 'cancel-queue';
    channel.assertQueue(cancelQueue, { durable: true });
    channel.sendToQueue(cancelQueue, Buffer.from(JSON.stringify({ username })));
    console.log(`Cancel request for ${username} sent to queue.`);
  }
  

  const server = app.listen(PORT, () => {
    console.log(`Matching service running on http://localhost:${PORT}`);
    initRabbitMQ();
});

wss = new WebSocket.Server({ server });