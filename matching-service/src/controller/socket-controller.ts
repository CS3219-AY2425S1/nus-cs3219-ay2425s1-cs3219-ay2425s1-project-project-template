import { Server, Socket } from "socket.io";
import { addUserToSearchPool, addUserToSocketMap, getSocketIdForUser, matchUsers, removeUserFromSearchPool, removeUserFromSocketMap } from "../model/matching-model";

export function initaliseData(socket: Socket) {
    const { userId } = socket.data;
    addUserToSocketMap(userId, socket.id);
    console.log(`User ${userId} connected via socket`);
}


// Handle user registration for matching
export function handleRegisterForMatching(socket: Socket, io: Server) {
    const { userId } = socket.data;
    socket.on('registerForMatching', (criteria) => {
        if (criteria.difficulty && criteria.topic) {
            addUserToSearchPool(userId, criteria);
            console.log(`User ${userId} registered with criteria`, criteria);
            socket.emit('registrationSuccess', { message: `User ${userId} registered for matching successfully.` });

            // Check if a match can be made for the new user
            const match = matchUsers();
            if (match) {
                const { matchedUsers } = match;
                const [user1, user2] = matchedUsers;

                // Notify both clients of the match using the mapping
                const socketId1 = getSocketIdForUser(user1.userId);
                const socketId2 = getSocketIdForUser(user2.userId);

                if (socketId1) {
                    io.sockets.sockets.get(socketId1)?.emit('matchFound', { matchedWith: user2.userId }); //INSERT SESSION ID HERE
                }
                if (socketId2) {
                    io.sockets.sockets.get(socketId2)?.emit('matchFound', { matchedWith: user1.userId }); //INSERT SESSION ID HERE
                }

                // Disconnect both users
                if (socketId1) {
                    io.sockets.sockets.get(socketId1)?.disconnect(true);
                }
                if (socketId2) {
                    io.sockets.sockets.get(socketId2)?.disconnect(true);
                }

                // Remove users from the map
                removeUserFromSocketMap(user1.userId);
                removeUserFromSocketMap(user2.userId);
            }
        } else {
            socket.emit('error', 'Invalid matching criteria.');
        }
    });
}

export function handleDisconnect(socket: Socket) {
    // Handle disconnection
    const { userId } = socket.data;
    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
        removeUserFromSearchPool(userId);

        // Remove the user from the map
        removeUserFromSocketMap(userId);
    });
}