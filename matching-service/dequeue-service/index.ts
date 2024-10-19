import express from 'express';
import { Kafka } from 'kafkajs';
import cors from "cors";

const app = express();

// Initialize Kafka
const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'dequeue-service' });

app.use(express.json());
app.use(cors());

// Timers Map to track match timers by userID
const timersMap = new Map();

// Start Kafka Producer
(async () => {
    await kafkaProducer.connect();
})();

// Listen for `match-events`
(async () => {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: 'match-events', fromBeginning: false });

    kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            const matchRequest = message.value ? JSON.parse(message.value.toString()) : {};
            const { userID } = matchRequest;

            console.log(`Received match-event for user: ${userID}`);

            // Start a timer for this match (e.g., 30 seconds)
            const timerID = setTimeout(async () => {
                console.log(`Timer up for user: ${userID}. Producing dequeue-event.`);

                // Produce `dequeue-event`
                await kafkaProducer.send({
                    topic: 'dequeue-events',
                    messages: [{ key: userID, value: JSON.stringify({ userID }) }],
                });

                // Remove the timer reference
                timersMap.delete(userID);
            }, 20000);

            // Store the timer reference in the map
            timersMap.set(userID, timerID);
        },
    });
})();


app.listen(3004, () => {
    console.log("Server started on port 3004");
});
