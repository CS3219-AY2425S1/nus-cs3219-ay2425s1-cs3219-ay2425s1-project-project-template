import { getRedisClient } from '../utils/redis-client';

interface SearchCriteria {
    difficulty: string;
    topic: string;
}

interface UserSearch {
    userId: string;
    socketId: string;
    criteria: SearchCriteria;
    startTime: Date;
}

// Get time spent matching for a specific user
export async function getTimeSpentMatching(userId: string): Promise<number | null> {
    const redisClient = getRedisClient();
    const user = await redisClient.hGetAll(`user:${userId}`);
    if (!user.startTime) return null;

    const now = new Date();
    const startTime = new Date(user.startTime);
    const timeSpent = now.getTime() - startTime.getTime();
    return Math.floor(timeSpent / 1000); // Time in seconds
}

// Get the count of users currently matching
export async function getCurrentMatchingUsersCount(): Promise<number> {
    const redisClient = getRedisClient();
    return await redisClient.sCard('searchPool');
}

// Perform the matching logic
export async function matchOrAddUserToSearchPool(userId: string, socketId: string, criteria: SearchCriteria) {
    const redisClient = getRedisClient();
    const topic = criteria.topic;
    const difficulty = criteria.difficulty;
    const startTime = new Date().toISOString();

    const result = await redisClient.matchOrAddUser(topic, difficulty, userId, socketId, startTime);

    console.log(`Matching user ${userId} with topic ${topic} and difficulty ${difficulty}`);
    console.log(`matching result for user ${userId}: ${JSON.stringify(result)}`);

    if (result) {
        const match = result;
        console.log(`Match found between ${match.matchedUsers[0].userId} and ${match.matchedUsers[1].userId}`);
        return match.matchedUsers;
    } else {
        console.log(`No match found, user ${userId} added to the search pool`);
        return null;
    }
}

// Get socket ID for a user
export async function getSocketIdForUser(userId: string): Promise<string> {
    const redisClient = getRedisClient();
    const user = await redisClient.hGetAll(`user:${userId}`);
    return user.socketId;
}

// Add user to the search pool
export async function addUserToSearchPool(userId: string, socketId: string, criteria: SearchCriteria) {
    const redisClient = getRedisClient();
    const startTime = new Date().toISOString();
    await redisClient.hSet(`user:${userId}`, {
        socketId,
        criteria: JSON.stringify(criteria),
        startTime
    });
    await redisClient.sAdd('searchPool', userId);
    console.log(`User ${userId} added to search pool`);
}

// Remove a user from the search pool
export async function removeUserFromSearchPool(userId: string): Promise<void> {
    const redisClient = getRedisClient();
    await redisClient.del(`user:${userId}`);
    await redisClient.sRem('searchPool', userId);
    console.log(`User ${userId} removed from search pool`);
}
