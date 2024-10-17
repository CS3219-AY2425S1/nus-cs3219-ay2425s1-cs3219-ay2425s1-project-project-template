matchingService.js
const amqp = require('amqplib');
const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 4000;

const redisClient = redis.createClient({
  socket: {
    host: 'matching-service-redis',
    port: 6379,
  }
});

app.use(express.json());

let connection;
let channel;
const activeSearches = {};

async function initRabbitMQ() {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Declare queues
  await channel.assertQueue('search_queue')
  await channel.assertQueue('match_found_queue');
  await channel.assertQueue('disconnect_queue');

  // Start listening for search requests
  channel.consume('search_queue', (msg) => {
    if (msg) {
      const searchRequest = JSON.parse(msg.content.toString());
      console.log(`Received search request:`, searchRequest);
      activeSearches[searchRequest.userId] = searchRequest;
      matchUsers(searchRequest);
      channel.ack(msg);
    }
  });

  // Listen for disconnection messages
  channel.consume('disconnect_queue', (msg) => {
    if (msg) {
      const disconnectRequest = JSON.parse(msg.content.toString());
      handleDisconnection(disconnectRequest.userId);
      channel.ack(msg);
    }
  });
}

async function initRedis() {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}

async function matchUsers(searchRequest) {
  const { userId, difficulty, topics } = searchRequest;

  const matchedUser = findMatchByTopics(topics) && findMatchByDifficulty(difficulty);

  if (matchedUser) {
    const matchMessage = {
      userId,
      matchUserId: matchedUser.userId,
    };

    channel.sendToQueue('match_found_queue', Buffer.from(JSON.stringify(matchMessage)));
    console.log(`Match found: User ID ${userId} matched with ${matchedUser.userId}`);
    delete activeSearches[userId];
    delete activeSearches[matchedUser.userId];
  }
}

function findMatchByTopics(topics) {
  if (topics.includes("simulate cannot find match")) {
    return null;
  }
  return { userId: 'mockUser123' };
}

function findMatchByDifficulty(difficulty) {
  if (difficulty == "simulate cannot find match") {
    return null;
  }
  return { userId: 'mockUser456' };
}

function handleDisconnection(userId) {
  if (activeSearches[userId]) {
    delete activeSearches[userId];
    console.log(`User ID: ${userId} has been removed from active searches.`);
  }
}

initRabbitMQ();
initRedis();

app.listen(PORT, () => {
  console.log(`Matching service is running and listening on port ${PORT}`);
});
