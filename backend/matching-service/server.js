import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { startRedis, enqueueSocket } from './controller/redis.js';
import cors from 'cors'; // Import cors
import exp from 'constants';


const port = process.env.PORT || 3003;


// Create an HTTP server
const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['my-custom-header'], // Allowed headers if needed
    credentials: true, // Allow credentials
  },
});

try {
  startRedis();   //create the redis queue to add incoming sockets
  console.log('Redis started');
} catch (error) {
  console.error('Error starting Redis:', error);
  process.exit(1);
}

httpServer.listen(port, () => {
  console.log('Matching Service listening on port ' + port);
});

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
