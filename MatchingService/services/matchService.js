import QueueModel from '../models/queue-model.js';
import queueService from './queueService.js';

const { addRequest, removeRequest, getQueue } = QueueModel;
const { publishMatchRequest, consumeMatchRequests } = queueService;

async function addMatchRequest(userId, topic, difficulty) {
    const requestData = { topic, difficulty };

    try {
        await addRequest(userId, requestData);
        const currentQueue = await getQueue();
        console.log("Enqueue Redis: ", currentQueue);
        
        await publishMatchRequest({ userId, topic, difficulty });
    } catch (error) {
        console.log(error.message);
    }
}

async function cancelMatchRequest(userId) {
    await removeRequest(userId);

    const currentQueue = await getQueue();
    console.log("Dequeue Redis (cancel request) : ", currentQueue);
}

async function processMatchQueue() {
    await consumeMatchRequests(async (message) => {
        const { userId, topic, difficulty } = message;
        const allRequests = await getQueue();

        const match = findMatch(allRequests, userId, topic, difficulty);
        if (match) {
            await removeRequest(userId);
            await removeRequest(match.userId);

            const queue = await getQueue();
            console.log(`Matched ${userId} with ${match.userId}`);
            console.log("Redis Queue (matched) : ", queue);
        }
    });
}

function findMatch(queue, userId, topic, difficulty) {
    // Try to match by same topic and difficulty
    const exactMatch = queue.find(
        req => req.userId !== userId && req.topic === topic && req.difficulty === difficulty
    );
    if (exactMatch) return exactMatch;

    // If no exact match, try to match by closest difficulty
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];
    const currentLevelIndex = difficultyLevels.indexOf(difficulty);

    for (let i = currentLevelIndex - 1; i <= currentLevelIndex + 1; i++) {
        if (i >= 0 && i < difficultyLevels.length) {
            const closestMatch = queue.find(
                req => req.userId !== userId && req.topic === topic && req.difficulty === difficultyLevels[i]
            );
            if (closestMatch) return closestMatch;
        }
    }

    return null;
}

export default {
    addMatchRequest,
    cancelMatchRequest,
    processMatchQueue
};
