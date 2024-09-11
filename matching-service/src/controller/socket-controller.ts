import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { addUserToSearchPool, getSocketIdForUser, matchUsers, removeUserFromSearchPool } from "../model/matching-model";
import redisClient from '../utils/redis-client';
import { acquireLock } from "../utils/redis-lock";

// Initialize Redis adapter for socket.io
export function initializeSocketIO(io: Server) {
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
            await addUserToSearchPool(userId, socket.id, criteria);
            console.log(`User ${userId} registered with criteria`, criteria);
            socket.emit('registrationSuccess', { message: `User ${userId} registered for matching successfully.` });

            // Check if a match can be made after new user joins
            await checkForMatch(io);

        } else {
            socket.emit('error', 'Invalid matching criteria.');
        }
    });
}

export async function checkForMatch(io: Server) {
    const match = await matchUsers();
    if (match) {
        const { matchedUsers } = match;
        const [user1, user2] = matchedUsers;
        // Notify both clients of the match using the mapping
        const socketId1 = await getSocketIdForUser(user1.userId);
        const socketId2 = await getSocketIdForUser(user2.userId);

        // check if both users are still connected
        const socket1 = io.sockets.sockets.get(socketId1);
        const socket2 = io.sockets.sockets.get(socketId2);

        if (socket1 && socket2) {
            console.log(`Emitted matchFound to ${user1.userId} at socket ${socketId1}`);
            io.to(socketId1).emit('matchFound', { matchedWith: user2.userId }); //INSERT SESSION ID HERE
            console.log(`Emitted matchFound to ${user2.userId} at socket ${socketId2}`);
            io.to(socketId2).emit('matchFound', { matchedWith: user1.userId }); //INSERT SESSION ID HERE
            //Disconnect both users (Disconnecting users also removes them from the search pool)
            socket1.disconnect(true);
            socket2.disconnect(true);
        }

        console.log(`${user1.userId} and ${user2.userId} has been matched`);
    }
}

export function handleDisconnect(socket: Socket) {
    // Handle disconnection
    const { userId } = socket.data;
    socket.on('disconnect', async () => {
        console.log(`User ${userId} disconnected`);
        await removeUserFromSearchPool(userId);
    });
}

// Subscribe to Redis channel for match notifications
export function subscribeToMatchNotifications(io: Server) {
    redisClient.subscribe('matchNotifications', (message: string) => {
        const { matchedUsers } = JSON.parse(message);
        matchedUsers.forEach(async (user: { userId: string }) => {
            const socketId = await getSocketIdForUser(user.userId);
            if (socketId) {
                io.to(socketId).emit('matchFound', { matchedWith: matchedUsers.find((u: { userId: string }) => u.userId !== user.userId).userId }); //INSERT SESSION ID HERE
            }
        });
    });
}
