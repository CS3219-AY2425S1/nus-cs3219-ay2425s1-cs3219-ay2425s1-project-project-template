import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'request-service' });


const verifyJWT = async (authorizationHeader: string | undefined) => {
    try {
        const response = await fetch("http://user-service:3001/auth/verify-token", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authorizationHeader}`,
            },
        });
        const data = await response.json();
        if (data.message !== "Token verified") {
            throw new Error(`JWT verification failed: ${data.message}`);
        }
        return data.data; // Return user data if verification is successful
    } catch (error) {
        throw new Error("Failed to verify JWT");
    }
};


router.post('/find-match', async (req, res) => {
    try {
        const userData = await verifyJWT(req.headers.authorization);

        // Create match request data
        const matchData = {
            userID: userData.id,  // Attach the userID
            topic: req.body.topic,
            difficulty: req.body.difficulty,
        };

        // Produce a `match-event`
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: "match-events",
            messages: [{ key: userData.id, value: JSON.stringify(matchData) }],
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
    try {
        const userData = await verifyJWT(req.headers.authorization);

        // Create cancelMatchData
        const cancelMatchData = {
            userID: userData.id,  // Attach the userID
        };

        // Produce a `cancel-match-event`
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: "cancel-match-events",
            messages: [{ key: userData.id, value: JSON.stringify(cancelMatchData) }],
        });
        await kafkaProducer.disconnect();

    } catch (error) {
        // TODO: Improve error handling
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get('/match-status', async (req, res) => {
    // TODO: Actually pull the correct match status instead of hardcoded
    res.json({
        matchStatus: "isNotMatching" // [isNotMatching, isMatching, isMatched]
    })
})

export default router;