// tests/socket.test.ts
import io, { Socket } from 'socket.io-client';
import { server } from '../src/server'; // Adjust path to server.ts
import jwt from 'jsonwebtoken';

const PORT = 8002;

beforeAll((done) => {
    server.listen(PORT, done);
});

afterAll((done) => {
    server.close(done);
});

describe('Socket.IO Server Tests', () => {

    test('should register a user and get success response', (done) => {

        const clientSocket = io(`http://localhost:${PORT}`, {
            auth: { token: jwt.sign({ userId: 'client-id' }, 'your_secret_key') },
        });
        clientSocket.emit('registerForMatching', { difficulty: 'easy', topic: 'math' });
        clientSocket.on('registrationSuccess', (message) => {
            expect(message.message).toBe('User client-id registered for matching successfully.');
            clientSocket.disconnect();
            done();
        });
    });

    test('should handle matching users and send matchFound event', (done) => {

        const clientSocket = io(`http://localhost:${PORT}`, {
            auth: { token: jwt.sign({ userId: 'client-id' }, 'your_secret_key') },
        });

        const anotherSocket = io(`http://localhost:${PORT}`, {
            auth: { token: jwt.sign({ userId: 'client-id2' }, 'your_secret_key')  },
        });


        anotherSocket.on('connect', () => {

            clientSocket.emit('registerForMatching', { difficulty: 'easy', topic: 'math' });

            anotherSocket.emit('registerForMatching', { difficulty: 'easy', topic: 'math' });

            anotherSocket.on('matchFound', (data) => {
                expect(data.matchedWith).toBe('client-id'); // Replace with actual expected value
                done();
            });

        });
    });
});
