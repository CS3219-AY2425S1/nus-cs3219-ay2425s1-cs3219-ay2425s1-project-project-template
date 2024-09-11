import redisClient from '../utils/redis-client';

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

// Add user to the search pool
export async function addUserToSearchPool(userId: string, socketId: string, criteria: SearchCriteria) {
    const startTime = new Date().toISOString();
    await redisClient.hSet(`user:${userId}`, {
        socketId,
        criteria: JSON.stringify(criteria),
        startTime
    });
    await redisClient.sAdd('searchPool', userId);
    console.log(`User ${userId} added to search pool`);
}

// Get time spent matching for a specific user
export async function getTimeSpentMatching(userId: string): Promise<number | null> {
    const user = await redisClient.hGetAll(`user:${userId}`);
    if (!user.startTime) return null;

    const now = new Date();
    const startTime = new Date(user.startTime);
    const timeSpent = now.getTime() - startTime.getTime();
    return Math.floor(timeSpent / 1000); // Time in seconds
}

// Get the count of users currently matching
export async function getCurrentMatchingUsersCount(): Promise<number> {
    return await redisClient.sCard('searchPool');
}

// Remove a user from the search pool
export async function removeUserFromSearchPool(userId: string): Promise<void> {
    await redisClient.del(`user:${userId}`);
    await redisClient.sRem('searchPool', userId);
    console.log(`User ${userId} removed from search pool`);
}

// Perform the matching logic
export async function matchUsers() {
    const userIds = await redisClient.sMembers('searchPool');
    const users = await Promise.all(userIds.map(async (userId) => {
        const user = await redisClient.hGetAll(`user:${userId}`);
        return {
            userId,
            socketId: user.socketId,
            criteria: JSON.parse(user.criteria),
            startTime: new Date(user.startTime)
        } as UserSearch;
    }));

    for (let i = 0; i < users.length - 1; i++) {
        for (let j = i + 1; j < users.length; j++) {
            if (isCriteriaMatching(users[i], users[j])) {
                console.log(`Match found between ${users[i].userId} and ${users[j].userId}`);
                const matchedUsers = [users[i], users[j]];
                const userIds = matchedUsers.map(user => user.userId);
                // Publish match notification to Redis channel
                await redisClient.publish('matchNotifications', JSON.stringify({ matchedUsers }));

                return { matchedUsers };
            }
        }
    }
    return null;
}

// Check if two users have matching criteria
function isCriteriaMatching(user1: UserSearch, user2: UserSearch): boolean {
    return user1.criteria.difficulty === user2.criteria.difficulty &&
           user1.criteria.topic === user2.criteria.topic;
}

// Get socket ID for a user
export async function getSocketIdForUser(userId: string): Promise<string> {
    const user = await redisClient.hGetAll(`user:${userId}`);
    return user.socketId;
}
