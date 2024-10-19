import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'request-service' });

const matchesMap = new Map();
const statusMap = new Map();

// TODO: When `cancel-match-event`, ser user status to `isNotMatching`

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

        // Set user status to `isMatching`
        statusMap.set(userData.id, 'isMatching');

        // Wait for information from the producer to see if match found
        const intervalID = setInterval(() => {
            console.log(matchesMap);
            if (matchesMap.has(userData.id)) {
                res.json({ message: "Match found!" });
                matchesMap.delete(userData.id);
                statusMap.set(userData.id, 'isMatched');
                clearInterval(intervalID);
            }
        }, 2000);

    } catch (error) {
        // TODO: Improve error handling
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Called when the client is already finding a match, and needs to listen for match found
router.post('/continue-matching', async (req, res) => {
    try {
        const userData = await verifyJWT(req.headers.authorization);

        // Wait for information from the producer to see if match found
        const intervalID = setInterval(() => {
            console.log(matchesMap);
            if (matchesMap.has(userData.id)) {
                res.json({ message: "Match found!" });
                matchesMap.delete(userData.id);
                statusMap.set(userData.id, 'isMatched');
                clearInterval(intervalID);
            }
        }, 2000);

    } catch (error) {
        // TODO: Improve error handling
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

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
    const userData = await verifyJWT(req.headers.authorization);

    if (statusMap.has(userData.id)) {
        res.json({ matchStatus: `${statusMap.get(userData.id)}` });
    } else {
        res.json({ matchStatus: 'isNotMatching' })
    }
})

router.get('/reset-match-status', async (req, res) => {
    statusMap.clear();
})

export default router;