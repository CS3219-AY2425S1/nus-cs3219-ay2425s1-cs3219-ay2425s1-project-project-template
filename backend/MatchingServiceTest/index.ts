import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected');
    
    // Request a match
    console.log('Requesting match...')
    socket.emit('request-match', {
        difficultyLevel: 'MEDIUm',
        category: 'ARRAYS'
    });
});

socket.on('match-request-accepted', () => {
    console.log('Match request accepted');
});

socket.on('match-found', (match) => {
    console.log('Match found:', match);
});

socket.on('match-timeout', () => {
    console.log('Match timeout');
});

socket.on('match-request-error', (message) => {
    console.log('Error requesting match:', message);
});