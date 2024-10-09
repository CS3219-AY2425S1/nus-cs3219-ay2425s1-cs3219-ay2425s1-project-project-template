import 'dotenv/config';
import { Server } from 'socket.io';
import { startRedis, enqueueSocket } from './controller/redis.js';

const port = process.env.PORT || 3003;

export const io = new Server(port);
startRedis();

io.on('connection', async (socket) => {
  try {
    // TODO: Verify socket by checking with jwt
    if (notVerifiedUser) {
      console.log('User not verified');
      socket.disconnect();
    }
    enqueueSocket(socket.id);
  } catch (err) {
    console.log(err.message);
    socket.disconnect();
  }
});
