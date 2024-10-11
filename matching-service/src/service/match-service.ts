// src/services/matchService.ts

import { MatchRequest } from '../types/match-types';
import { connectRabbitMQ, getChannel } from '../queue/rabbitmq';

let matchQueue: MatchRequest[] = [];

// Function to add a match request to the queue
export async function addMatchRequest(matchRequest: MatchRequest): Promise<void> {
  await connectRabbitMQ();
  const channel = getChannel();
  channel.sendToQueue('match_requests', Buffer.from(JSON.stringify(matchRequest)));
}

// Function to consume match requests from the queue
export async function consumeMatchRequests(): Promise<void> {
  await connectRabbitMQ();
  const channel = getChannel();

  channel.consume('match_requests', (msg) => {
    if (msg !== null) {
      const matchRequest: MatchRequest = JSON.parse(msg.content.toString());
      processMatchRequest(matchRequest);
      channel.ack(msg);
    }
  });
}

// Function to process a match request
function processMatchRequest(request: MatchRequest): void {
  // Add request to in-memory queue
  matchQueue.push(request);

  console.log('Current Match Queue:', matchQueue);

  // Attempt to find a match
  const match = findMatch(request);

  if (match) {
    // Remove matched requests from the queue
    matchQueue = matchQueue.filter(
      (req) => req.userId !== request.userId && req.userId !== match.userId
    );

    // Notify users (in a real application, you might send a message back or update a database)
    console.log(`Match found between ${request.userId} and ${match.userId}`);
  } else {
    console.log(`No immediate match for ${request.userId}, waiting for 30 seconds.`);

    // Handle timeout (30 seconds)
    setTimeout(() => {
      // Check if the request is still in the queue
      const isStillWaiting = matchQueue.some((req) => req.userId === request.userId);
      if (isStillWaiting) {
        // Remove the request after timeout
        matchQueue = matchQueue.filter((req) => req.userId !== request.userId);
        console.log(`No match found for ${request.userId} within the time limit.`);
        // Optionally, notify the user that no match was found
      }
    }, 30000);
  }
}

// Function to find a match
function findMatch(request: MatchRequest): MatchRequest | null {
  // Prioritize matching on topic, then difficulty
  const exactMatch = matchQueue.find(
    (req) =>
      req.userId !== request.userId &&
      req.topic === request.topic &&
      req.difficulty === request.difficulty
  );

  if (exactMatch) {
    return exactMatch;
  }

  const topicMatch = matchQueue.find(
    (req) => req.userId !== request.userId && req.difficulty === request.difficulty
  );

  return topicMatch || null;
}
