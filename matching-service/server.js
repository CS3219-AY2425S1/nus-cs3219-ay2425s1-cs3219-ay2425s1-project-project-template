// matchingService.js
const amqp = require('amqplib');
const express = require('express');

const app = express();
const PORT = 4000;

app.use(express.json());

let connection;
let channel;
const activeSearches = {}; // Track active searches

async function initRabbitMQ() {
  connection = await amqp.connect('amqp://user:password@rabbitmq:5672/');
  channel = await connection.createChannel();

  // Declare queues
  await channel.assertQueue('search_queue');
  await channel.assertQueue('match_found_queue'); 
  await channel.assertQueue('disconnect_queue'); 

  // Start listening for search requests
  channel.consume('search_queue', (msg) => {
    if (msg) {
      const searchRequest = JSON.parse(msg.content.toString());
      console.log(`Received search request:`, searchRequest);
      activeSearches[searchRequest.userId] = searchRequest; // Store active search
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

// Function to match users based on topics first, then difficulty
async function matchUsers(searchRequest) {
  const { userId, difficulty, topics } = searchRequest;

  // Attempt to match by topics first
  const matchedUser = findMatchByTopics(topics) || findMatchByDifficulty(difficulty);

  if (matchedUser) {
    const matchMessage = {
      userId,
      matchUserId: matchedUser.userId,
    };

    channel.sendToQueue('match_found_queue', Buffer.from(JSON.stringify(matchMessage)));
    console.log(`Match found: User ID ${userId} matched with ${matchedUser.userId}`);
  }
}

// Function to find a match based on topics
function findMatchByTopics(topics) {
  // Implement logic to find a match based on topics
  // For demonstration, returning a mock matched user
  if (topics.includes("exampleTopic")) {
    return { userId: 'mockUser123' }; // Replace with actual user lookup
  }
  return null;
}

// Function to find a match based on difficulty if no topic matches
function findMatchByDifficulty(difficulty) {
  // Implement logic to find a match based on difficulty
  return { userId: 'mockUser456' }; // Replace with actual user lookup
}

// Handle user disconnection
function handleDisconnection(userId) {
  if (activeSearches[userId]) {
    delete activeSearches[userId]; // Remove user from active searches
    console.log(`User ID: ${userId} has been removed from active searches.`);
  }
}

// Start the RabbitMQ connection
initRabbitMQ();

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Matching service is running and listening on port ${PORT}`);
});
