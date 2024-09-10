interface SearchCriteria {
    difficulty: string;
    topic: string;
}

interface UserSearch {
    userId: string;
    criteria: SearchCriteria;
    startTime: Date;
}

const searchPool: UserSearch[] = [];

// Add user to the search pool
export function addUserToSearchPool(userId: string, criteria: SearchCriteria) {
    const startTime = new Date();
    searchPool.push({ userId, criteria, startTime });
    console.log(`User ${userId} added to search pool`);
}

// Get time spent matching for a specific user
export function getTimeSpentMatching(userId: string): number | null {
    const user = searchPool.find(u => u.userId === userId);
    if (!user) return null;

    const now = new Date();
    const timeSpent = now.getTime() - user.startTime.getTime();
    return Math.floor(timeSpent / 1000); // Time in seconds
}

// Get the count of users currently matching
export function getCurrentMatchingUsersCount(): number {
    return searchPool.length;
}

// Remove a user from the search pool
export function removeUserFromSearchPool(userId: string): UserSearch | null {
    const index = searchPool.findIndex(u => u.userId === userId);
    if (index !== -1) {
        console.log(`User ${userId} removed from search pool`);
        return searchPool.splice(index, 1)[0];
    }
    return null;
}

// Perform the matching logic
export function matchUsers() {
    for (let i = 0; i < searchPool.length - 1; i++) {
        for (let j = i + 1; j < searchPool.length; j++) {
            if (isCriteriaMatching(searchPool[i], searchPool[j])) {
                console.log(`Match found between ${searchPool[i].userId} and ${searchPool[j].userId}`);
                const matchedUsers = [searchPool[i], searchPool[j]];
                const userids = matchedUsers.map(user => user.userId);
                userids.forEach(userId => { removeUserFromSearchPool(userId); });
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
