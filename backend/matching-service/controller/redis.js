import Redis from 'ioredis';
import { io } from '../server.js';

let socketChannel;

export const startRedis = async () => {
  socketChannel = new Redis({
    port: 3003,
    host: 'localhost',
  });
};

export const enqueueSocket = async (socketId, topic, complexity, waitTime) => {
  // Check if there is another socket in the queue with the same complexity
  const topicAndComplexity = `${topic}:${complexity}`;
  const waitTimeInSeconds = 0
  if (waitTime <= 5) {  // handles 1, 2 and 5 minutes
    waitTimeInSeconds = waitTime * 60;
  } else {
    waitTimeInSeconds = waitTime;
  }
  const matchExists = await socketChannel.get(topicAndComplexity); //return null if not found, else socketId. Ideally same as socketId
  if (matchExists) {
    // Found a match
    const socketId2 = await socketChannel.get(topicAndComplexity);    //get socketId of match
    socketChannel.del(topicAndComplexity);    //delete this socketId from the queue

    // TODO: Replace with collaboration service room id
    const roomId = Math.random().toString(36).substring(7);
    io.to(socketId).emit('matchFound', roomId);
    io.to(socketId2).emit('matchFound', roomId);
    console.log(`Matched ${socketId} with ${socketId2}, roomId: ${roomId}`);
    io.sockets.sockets.get(socketId).disconnect();
    io.sockets.sockets.get(socketId2).disconnect();
  } else {
    // No match found
    console.log('Waiting for match');
    io.to(socketId).emit('message', 'Waiting for a match');
    await storeSocket(socketId, topic, complexity, waitTimeInSeconds);
    setTimeout(() => onSocketExpiry(socketId, topic, complexity), waitTimeInSeconds);
  }
};

const storeSocket = async (socketId, topic, complexity, waitTimeInSeconds) => {
  const topicAndComplexity = `${topic}:${complexity}`;
  try {
    await socketChannel.set(topicAndComplexity, socketId, 'EX', waitTimeInSeconds);
  } catch (error) {
    console.log(error.message);
    io.to(socketId).emit('error', 'Failed to store socket');
    io.to(socketId).disconnect();
  }
};

const onSocketExpiry = async (socketId, topic, complexity) => {
  try {
    // Check if socket is still in the queue
    const topicAndComplexity = `${topic}:${complexity}`;
    const retrievedSocketId = socketChannel.get(topicAndComplexity);  //returns socketId
    if (retrievedSocketId === socketId) {
      console.log(`Socket ${socketId} expired`);
      // Remove socket from queue
      socketChannel.del(topicAndComplexity);
      console.log(`Socket ${socketId} expired`);
      io.to(socketId).emit('message', 'Failed to find match');
      io.to(socketId).disconnect();
    }
  } catch (error) {
    console.log(error.message);
  }
};
