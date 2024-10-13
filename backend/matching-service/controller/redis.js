import Redis from 'ioredis';
import { io } from '../server.js';

let socketChannel;

export const startRedis = async () => {
  socketChannel = new Redis();
};

export const enqueueSocket = async (socketId, complexity) => {
  // Check if there is another socket in the queue with the same complexity
  const complexityContainsSocket = await socketChannel.get(complexity);
  if (complexityContainsSocket) {
    // Found a match
    const socketId2 = await socketChannel.get(complexity);
    socketChannel.del(complexity);

    // TODO: Replace with collaboration service room id
    const roomId = Math.random().toString(36).substring(7);
    io.to(socketId).emit('matchFound', roomId);
    io.to(socketId2).emit('matchFound', roomId);
    console.log(`Matched ${socketId} with ${socketId2}`);
    io.sockets.sockets.get(socketId).disconnect();
    io.sockets.sockets.get(socketId2).disconnect();
  } else {
    // No match found
    console.log('Waiting for match');
    io.to(socketId).emit('message', 'Waiting for a match');
    await storeSocket(socketId, complexity);
    setTimeout(() => onSocketExpiry(socketId, complexity), 20000);
  }
};

const storeSocket = async (socketId, complexity) => {
  try {
    await socketChannel.set(complexity, socketId, 'EX', 60);
  } catch (error) {
    console.log(error.message);
    io.to(socketId).emit('error', 'Failed to store socket');
    io.to(socketId).disconnect();
  }
};

const onSocketExpiry = async (socketId, complexity) => {
  try {
    // Check if socket is still in the queue
    const retrievedSocketId = socketChannel.get(complexity);
    if (retrievedSocketId === socketId) {
      console.log(`Socket ${socketId} expired`);
      // Remove socket from queue
      socketChannel.del(complexity);
      console.log(`Socket ${socketId} expired`);
      io.to(socketId).emit('message', 'Failed to find match');
      io.to(socketId).disconnect();
    }
  } catch (error) {
    console.log(error.message);
  }
};
