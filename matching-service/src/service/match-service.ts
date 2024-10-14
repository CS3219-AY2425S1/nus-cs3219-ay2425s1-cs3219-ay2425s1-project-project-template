import { Server } from 'socket.io';
import { MatchRequest } from '../types/match-types';
import { connectRabbitMQ, getChannel } from '../queue/rabbitmq';
import Redis from 'ioredis';

let matchQueue: MatchRequest[] = [];

const redis = new Redis();

// Function to add a match request to the queue
export async function addMatchRequest(matchRequest: MatchRequest): Promise<void> {
  await connectRabbitMQ();
  const channel = getChannel();
  channel.sendToQueue('match_requests', Buffer.from(JSON.stringify(matchRequest)));
}

// Function to consume match requests from the queue
export async function consumeMatchRequests(io: Server): Promise<void> {
  await connectRabbitMQ();
  const channel = getChannel();

  channel.consume('match_requests', (msg) => {
    if (msg !== null) {
      const matchRequest: MatchRequest = JSON.parse(msg.content.toString());
      processMatchRequest(matchRequest, io);
      channel.ack(msg);
    }
  });
}

// Function to process a match request
async function processMatchRequest(request: MatchRequest, io: Server) {
  const requestKey = `match_request:${request.userId}`;
  const requestData = JSON.stringify(request);
  redis.set(requestKey, requestData, 'EX', 31);

  // Attempt to find a match
  const match = await findMatch(request);

  if (match) {
    redis.del(requestKey);
    redis.del(`match_request:${match.userId}`);
    console.log(`Match found between ${request.userId} and ${match.userId}`);

    io.to(request.userId).emit('match_found', { success: true, matchUserId: match.userId });
    io.to(match.userId).emit('match_found', { success: true, matchUserId: request.userId });
  } else {
    console.log(`No immediate match for ${request.userId}, waiting for 30 seconds.`);
    setTimeout(async () => {
      const isStillWaiting = await redis.exists(requestKey);
      if (isStillWaiting) {
        await redis.del(requestKey);
        console.log(`No match found for ${request.userId} within the time limit.`);
        io.to(request.userId).emit('match_timeout', { success: false, message: 'No match found within time limit.' });
      }
    }, 30000);
  }
}

async function findMatch(request: MatchRequest): Promise<MatchRequest | null> {
  const { userId, topic, difficulty } = request;
  const exactMatchKey = `match_queue:topic:${topic}:difficulty:${difficulty}`;
  await redis.srem(exactMatchKey, userId);

  let matchUserId = await redis.spop(exactMatchKey);

  while (matchUserId) {
    if (matchUserId !== userId) {
      const matchData = await redis.get(`match_request:${matchUserId}`);
      if (matchData) {
        const matchRequest: MatchRequest = JSON.parse(matchData);
        return matchRequest;
      }
    }
    matchUserId = await redis.spop(exactMatchKey);
  }

  await redis.sadd(exactMatchKey, userId);
  await redis.expire(exactMatchKey, 31);

  return null;
}

// Function to cancel a match request (used when a user leaves the room)
export async function cancelMatchRequest(userId: string, io: Server): Promise<void> {
  const requestKey = `match_request:${userId}`;
  const isDeleted = await redis.del(requestKey);

  if (isDeleted) {
    console.log(`Match request for user ${userId} cancelled successfully.`);
    io.to(userId).emit('match_cancelled', { success: true, message: 'Match request cancelled.' });
    console.log("done")
  } else {
    console.log(`No match request found for user ${userId}.`);
    io.to(userId).emit('match_cancelled', { success: false, message: 'No match request found to cancel.' });
  }
}
