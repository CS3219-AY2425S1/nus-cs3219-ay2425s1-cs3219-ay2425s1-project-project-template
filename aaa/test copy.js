const EventSource = require('eventsource');

const userEmail = 'hello@gmail.com'; // Change to your test user email
const eventSource = new EventSource(`http://localhost:3009/rabbitmq/hello@gmail.com`);
console.log("Connected")
eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.userEmail == userEmail) {
        console.log('Match found:', data);
    }
};

eventSource.onerror = function (err) {
    console.error('EventSource failed:', err);
};
