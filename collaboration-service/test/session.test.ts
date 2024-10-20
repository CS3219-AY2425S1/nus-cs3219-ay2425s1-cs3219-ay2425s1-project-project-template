import io, { Socket } from 'socket.io-client';
import { server } from '../src/server'; // Adjust path to server.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import useSWR from "swr";

dotenv.config();

const PORT = process.env.PORT || 8001;
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';


console.log('Environment Variables:', process.env);


// Creation of tests
describe('session related tests', () => {

    test('should create a new room based on information given', (done) => {
        fetch(`http://localhost:${PORT}/api/session/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                participants: ['user1', 'user2'],
                question: 'What is the meaning of life?',
                code: 'console.log("Hello, World!");'
            })
        })
            .then(res => {
                expect(res.status).toBe(201);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    test('user should be able to join room', (done) => {
        fetch(`http://localhost:${PORT}/api/session`, {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: 'some-session-id',
                userId: 'user1'
            })
        })
            .then(res => {
                expect(res.status).toBe(200);
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});