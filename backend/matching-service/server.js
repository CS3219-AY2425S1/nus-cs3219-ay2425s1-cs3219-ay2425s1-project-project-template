import 'dotenv/config';
import { Server } from 'socket.io';
import { startRedis, enqueueSocket } from './controller/redis.js';

const port = process.env.PORT || 3003;

export const io = new Server(port);
startRedis();
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
    const complexity = socket.handshake.query.complexity;
    enqueueSocket(socket.id, complexity);
  } catch (err) {
    console.log(err.message);
    socket.disconnect();
  }
});
