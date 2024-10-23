// services/MatchService.js
import { addRequest, removeRequest, getQueue } from '../models/queue-model';
import { publishMatchRequest, consumeMatchRequests } from './queueService';

async function addMatchRequest(userId, topic, difficulty) {
    const requestData = { topic, difficulty };

    try {
        await addRequest(userId, requestData);
        await publishMatchRequest({ userId, topic, difficulty });
    } catch (error) {
        console.log(error.message);
    }
}

async function cancelMatchRequest(userId) {
    await removeRequest(userId);
}

async function processMatchQueue() {
    await consumeMatchRequests(async (message) => {
        const { userId, topic, difficulty } = message;
        const allRequests = await getQueue();

        const match = findMatch(allRequests, userId, topic, difficulty);
        if (match) {
            await removeRequest(userId);
            await removeRequest(match.userId);
            console.log(`Matched ${userId} with ${match.userId}`);
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
