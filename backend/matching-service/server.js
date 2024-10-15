import 'dotenv/config';
import { Server } from 'socket.io';
import { startRedis, enqueueSocket } from './controller/redis.js';

const port = process.env.PORT || 3003;

export const io = new Server(port);
try {
  startRedis();   //create the redis queue to add incoming sockets
  console.log('Redis started');
} catch (error) {
  console.error('Error starting Redis:', error);
  process.exit(1);
}

console.log('Matching Service listening on port ' + port);

io.on('connection', async (socket) => {
  try {
    console.log('New socket connected: ' + socket.id);
    const jwt = socket.handshake.auth.token;
    // Do checks here to verify the user
    // if (notVerifiedUser) {
    //   console.log('User not verified');
    //   socket.disconnect();
    // }
    const topic = socket.handshake.query.topic;
    const complexity = socket.handshake.query.complexity;
    const waitTime = socket.handshake.query.waitTime;
    
    enqueueSocket(socket.id, topic, complexity, waitTime);
  } catch (err) {
    console.log(err.message);
    socket.disconnect();
  }
});
