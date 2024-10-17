import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'request-service' });

router.post('/find-match', async (req, res) => {
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Request Body:', req.body);

    try {
        // Verify the JWT
        const response = await fetch("http://user-service:3001/auth/verify-token", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${req.headers.authorization}`,
            },
        });
        const data = await response.json();
        if (data.message !== "Token verified") {
            res.json({ message: `Error finding match: ${data.message}` });
            return
        }

        // Extract userID
        const userID = data.data.id;

        // Create match request data
        const matchData = {
            userID: userID,  // Attach the userID
            topic: req.body.topic,
            difficulty: req.body.difficulty,
        };

        // Produce a `match-event`
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: "match-events",
            messages: [{ key: userID, value: JSON.stringify(matchData) }],
        });
        await kafkaProducer.disconnect();

        // Set up consumer for `match-found-event`
        let responded = false;
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe({ topic: 'match-found-events', fromBeginning: false });

        // Kafka consumer logic
        await kafkaConsumer.run({
            eachMessage: async ({ message }) => {
                // TODO: Logic to check if the match-found-event is for the specific user
                // const foundMatch = JSON.parse(message.value.toString());
                // if (foundMatch.userID === userID && !responded) {
                //     responded = true;
                //     return res.json({ message: "Match found!", data: foundMatch });
                // }
            },
        });
        await kafkaConsumer.disconnect();

        // Fallback response after delay (simulating long-polling)
        setTimeout(() => {
            if (!responded) {
                responded = true;
                res.json({ message: "Pseudo match found!" });
            }
        }, 3000);

    } catch (error) {
        // TODO: Improve error handling
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/cancel-matching', async (req, res) => {
    // TODO: Produce a `cancel-match-event`
})

router.get('/match-status', async (req, res) => {
    // TODO: Actually pull the correct match status instead of hardcoded
    res.json({
        matchStatus: "isNotMatching" // [isNotMatching, isMatching, isMatched]
    })
})

export default router;