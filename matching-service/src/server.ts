import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { validateSocketJWT } from './middleware/jwt-validation';
import {
    addUserToSearchPool,
    removeUserFromSearchPool,
    matchUsers
} from './model/matching-model';

// Create the express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust this based on your allowed origins
    },
});

// Middleware for parsing JSON
app.use(express.json());

// Maintain a mapping of userId to socket.id
const userSocketMap = new Map<string, string>();

// Socket.io connection handler with JWT validation
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided.'));
    }

    try {
        // Validate the token and extract the userId
        const decoded = validateSocketJWT(token);
        socket.data.userId = decoded.userId;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token.'));
    }
});

io.on('connection', (socket) => {
    const { userId } = socket.data;

    // Map the userId to the socket.id
    userSocketMap.set(userId, socket.id);

    console.log(`User ${userId} connected via socket`);

    // Handle user registration for matching
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
                const socketId1 = userSocketMap.get(user1.userId);
                const socketId2 = userSocketMap.get(user2.userId);

                if (socketId1) {
                    io.sockets.sockets.get(socketId1)?.emit('matchFound', { matchedWith: user2.userId });
                }
                if (socketId2) {
                    io.sockets.sockets.get(socketId2)?.emit('matchFound', { matchedWith: user1.userId });
                }

                // Disconnect both users
                if (socketId1) {
                    io.sockets.sockets.get(socketId1)?.disconnect(true);
                }
                if (socketId2) {
                    io.sockets.sockets.get(socketId2)?.disconnect(true);
                }

                // Remove users from the map
                userSocketMap.delete(user1.userId);
                userSocketMap.delete(user2.userId);
            }
        } else {
            socket.emit('error', 'Invalid matching criteria.');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
        removeUserFromSearchPool(userId);

        // Remove the user from the map
        userSocketMap.delete(userId);
    });
});

export { server };

if (require.main === module) {
    // Start the server
    const PORT = 8002;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
// Start the server
// const PORT = 8002;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
