import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { addUserToSearchPool, matchOrAddUserToSearchPool, removeUserFromSearchPool } from "../model/matching-model";
import { getRedisClient } from '../utils/redis-client';

// Initialize Redis adapter for socket.io
export function initializeSocketIO(io: Server) {
    const redisClient = getRedisClient();
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    // allows for multiple instances of the server to communicate with each other
}

// Handle user registration for matching
// TODO: Consider race conditions and locking mechanisms
export function handleRegisterForMatching(socket: Socket, io: Server) {
    const { userId } = socket.data;
    socket.on('registerForMatching', async (criteria) => {
        if (criteria.difficulty && criteria.topic) {

            const status = await matchOrAddUserToSearchPool(userId, socket.id, criteria);
            if (status) {
                const socketId1 = status[0].socketId;
                const socketId2 = status[1].socketId;

                // check if both users are still connected
                const socket1 = io.sockets.sockets.get(socketId1);
                const socket2 = io.sockets.sockets.get(socketId2);

                if (socket1 && socket2) {

                    console.log(`User ${userId} matched with ${status[1].userId}`);
                    // Match users and notify them
                    console.log(`Emitted matchFound to ${status[0].userId} at socket ${socketId1}`);
                    io.to(socketId1).emit('matchFound', { matchedWith: status[1].userId }); //INSERT SESSION ID HERE
                    console.log(`Emitted matchFound to ${status[1].userId} at socket ${socketId2}`);
                    io.to(socketId2).emit('matchFound', { matchedWith: status[0].userId }); //INSERT SESSION ID HERE

                    //Disconnect both users
                    socket1.disconnect(true);
                    socket2.disconnect(true);
                } else {
                    // Handle case where user disconnected on matching (Add other user back to search pool)
                    if (socket1 && !socket2) {
                        addUserToSearchPool(status[1].userId, status[1].socketId, status[1].criteria);
                    }
                    if (socket2 && !socket1) {
                        addUserToSearchPool(status[0].userId, status[0].socketId, status[0].criteria);
                    }
                }
            } else {
                console.log(`User ${userId} registered for matching`);
                socket.emit('registrationSuccess', { message: `User ${userId} registered for matching successfully.` });
            }

        } else {
            socket.emit('error', 'Invalid matching criteria.');
        }
    });
}

export function handleDeregisterForMatching(socket: Socket) {
    socket.on('deregisterForMatching', async () => {
        console.log(`User ${socket.data.userId} deregistered for matching`);
        await removeUserFromSearchPool(socket.data.userId);
    });
}

export function handleDisconnect(socket: Socket) {
    // Handle disconnection
    const { userId } = socket.data;
    socket.on('disconnect', async () => {
        console.log(`User ${userId} disconnected`);
        await removeUserFromSearchPool(userId);
    });
}
