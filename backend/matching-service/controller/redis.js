import Redis from 'ioredis';
import { io } from '../server';

let socketChannel;

export const startRedis = async () => {
  socketChannel = new Redis();
  socketChannel.subscribe('__keyevent@0__:expired');
  socketChannel.on('message', async (channel, message) => {
    const socketId = message;
    onSocketExpiry(socketId);
  });
};

export const enqueueSocket = async (socketId) => {
  const complexity = socket.handshake.query.complexity;
  // Check if there is another socket in the queue with the same complexity
  const complexityContainsSocket = await socketChannel.get(complexity);
  if (complexityContainsSocket) {
    // Found a match
    const socketId2 = socketChannel.get(complexity);
    socketChannel.del(complexity);

    // TODO: Replace with collaboration service room id
    const roomId = Math.random().toString(36).substring(7);
    io.to(socketId).emit('match', roomId);
    io.to(socketId2).emit('match', roomId);
  } else {
    // No match found
    await storeSocket(socketId, complexity);
  }
};

const storeSocket = async (socketId, complexity) => {
  try {
    await socketChannel.set(complexity, socketId);
  } catch (error) {
    console.log(error.message);
    io.to(socketId).emit('error', 'Failed to store socket');
    io.to(socketId).disconnect();
  }
};

const onSocketExpiry = async (socketId) => {
  try {
    // TODO: socket send message to user saying that match is not found
    io.to(socketId).emit('message', 'Failed to find match');
    // TODO: disconnect socket
    io.to(socketId).disconnect();
  } catch (error) {
    console.log(error.message);
  }
};
