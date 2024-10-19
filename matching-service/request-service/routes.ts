import { Router } from 'express';
import { Kafka } from 'kafkajs';

const router = Router();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'request-service' });
const dequeueConsumer = kafka.consumer({ groupId: 'request-service-dequeue' }); // New consumer for dequeue-events

const matchesMap = new Map();
const statusMap = new Map();

// TODO: When `cancel-match-event`, ser user status to `isNotMatching`

(async () => {
    await kafkaProducer.connect();

    // Setup Kafka consumer to update matchesMap and status map once any match has been found
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: 'match-found-events', fromBeginning: false });
    kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            console.log(message);
            if (message.value) {
                const matchFoundData = JSON.parse(message.value.toString());
                matchesMap.set(matchFoundData.userA, matchFoundData);
                matchesMap.set(matchFoundData.userB, matchFoundData);
                statusMap.set(matchFoundData.userA, 'isMatched');
                statusMap.set(matchFoundData.userB, 'isMatched');
            }
        },
    });
})();

// Listen to dequeue events
(async () => {
  await dequeueConsumer.connect();
  await dequeueConsumer.subscribe({ topic: 'dequeue-events', fromBeginning: false });

  await dequeueConsumer.run({
    eachMessage: async ({ message }) => {
      const { userID } = message.value ? JSON.parse(message.value.toString()) : {};
      console.log(`Received dequeue event for userID: ${userID}`);
      statusMap.set(userID, 'isNotMatching');
      console.log(`User ${userID} removed from match queue.`);
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
        res.json({ message: "Received match request" });

        // Wait for information from the producer to see if match found
        // const intervalID = setInterval(() => {
        //     console.log("Initial find: ", matchesMap);
        //     if (matchesMap.has(userData.id)) {
        //         res.json({ message: "Match found!" });
        //         matchesMap.delete(userData.id);
        //         statusMap.set(userData.id, 'isMatched');
        //         clearInterval(intervalID);
        //     }
        // }, 2000);

    } catch (error) {
        // TODO: Improve error handling
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Called when the client is already finding a match, and needs to listen for match found
// To store active intervals for each user
// const activeIntervals = new Map();
// 
// router.post('/continue-matching', async (req, res) => {
//     try {
//         const userData = await verifyJWT(req.headers.authorization);
// 
//         // If an interval is already active for this user, clear it first
//         if (activeIntervals.has(userData.id)) {
//             clearInterval(activeIntervals.get(userData.id));  // Clear the old interval
//             activeIntervals.delete(userData.id);  // Remove it from the map
//         }
// 
//         // Start a new interval to check for a match
//         const intervalID = setInterval(() => {
//             console.log("Continue: ", matchesMap);
// 
//             if (matchesMap.has(userData.id)) {
//                 // Match found, send response and clear interval
//                 res.json({ message: "Match found!" });
//                 matchesMap.delete(userData.id);  // Remove the match from the map
//                 statusMap.set(userData.id, 'isMatched');  // Update status
// 
//                 clearInterval(intervalID);  // Clear the current interval
//                 activeIntervals.delete(userData.id);  // Remove from active intervals map
//             }
//         }, 2000);
// 
//         // Store the interval in the activeIntervals map
//         activeIntervals.set(userData.id, intervalID);
// 
//     } catch (error) {
//         console.error("Error: ", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


// router.post('/cancel-matching', async (req, res) => {
//     try {
//         const userData = await verifyJWT(req.headers.authorization);
// 
//         // Create cancelMatchData
//         const cancelMatchData = {
//             userID: userData.id,  // Attach the userID
//         };
// 
//         // Produce a `cancel-match-event`
//         await kafkaProducer.send({
//             topic: "cancel-match-events",
//             messages: [{ key: userData.id, value: JSON.stringify(cancelMatchData) }],
//         });
// 
//     } catch (error) {
//         // TODO: Improve error handling
//         console.error("Error: ", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// })

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