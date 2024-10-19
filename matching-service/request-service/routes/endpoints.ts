import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'request-service' });

const matchesMap = new Map();

(async () => {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: 'match-found-events', fromBeginning: false });
    kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            console.log(message);
            if (message.value) {
                const matchFoundData = JSON.parse(message.value.toString());
                matchesMap.set(matchFoundData.userA, matchFoundData);
                matchesMap.set(matchFoundData.userB, matchFoundData);
            }
        },
    });
})();

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
        const matchRequestData = {
            userID: userData.id,
            topic: req.body.topic,
            difficulty: req.body.difficulty,
            timestamp: Date.now().toString(),
        }

        // Produce a `match-event`
        await kafkaProducer.send({
            topic: "match-events",
            messages: [{ key: userData.id, value: JSON.stringify(matchRequestData) }],
        });

        // Wait for information from the producer to see if match found
        setInterval(() => {
            console.log(matchesMap);
            if (matchesMap.has(userData.id)) {
                res.json({ message: "Match found!" });
                matchesMap.delete(userData.id);
                return
            }
        }, 2000);

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
        await kafkaProducer.send({
            topic: "cancel-match-events",
            messages: [{ key: userData.id, value: JSON.stringify(cancelMatchData) }],
        });

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